const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { getEsewaPaymentHash, verifyEsewaPayment } = require("../utils/esewa");
const { Transaction, Order, Book, Address,Cart } = require("../models");

const initializeEsewa = async (req, res) => {
  try {
    const { book_ids, amount, address_id } = req.body;
    const user_id = req.user.userId;

    const books = await Book.findAll({
      where: {
        id: { [Op.in]: book_ids },
        status:{[Op.in]: ["Available","Reserved"]}
      },
    });

    if (books.length !== book_ids.length) {
      return res
        .status(400)
        .json({ message: "One or more books are not available" });
    }

    // Delete any old PENDING transaction from this user
    await Transaction.destroy({
      where: { user_id, status: "PENDING" },
    });

    const transaction_uuid = uuidv4();

    const transaction = await Transaction.create({
      user_id,
      book_ids,
      amount,
      address_id,
      transaction_uuid,
      payment_gateway: "esewa",
      status: "PENDING",
    });

    const paymentHash = getEsewaPaymentHash({ amount, transaction_uuid });

    res.json({
      success: true,
      payment: paymentHash,
      transaction,
      esewaUrl: `${process.env.ESEWA_GATEWAY_URL}/api/epay/main/v2/form`,
      productCode: process.env.ESEWA_PRODUCT_CODE,
    });

    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const esewaSuccess = async (req, res) => {

  console.log("esewaSuccess hit", req.query);
  console.log("full url:", req.url);
  console.log("all params:", req.params);
  console.log("body:", req.body);
  try {
    const { data } = req.query;
    const { decodedData } = await verifyEsewaPayment(data);

    console.log("decoded transaction_uuid:", decodedData.transaction_uuid);

    const transaction = await Transaction.findOne({
      where: { transaction_uuid: decodedData.transaction_uuid },
    });

    console.log("found transaction:", transaction);

    if (!transaction) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }

    const books = await Book.findAll({
      where: { id: { [Op.in]: transaction.book_ids } },
    });

    const address = await Address.findByPk(transaction.address_id);

    for (const book of books) {
      await Order.create({
        book_id: book.id,
    buyer_id: transaction.user_id,
    seller_id: book.user_id,
    delivery_street: address?.street,
    delivery_city: address?.city,
    delivery_district: address?.district,
    delivery_province: address?.province,
    total_price: book.price,
    status: "Completed",
      });

      await book.update({ status: "Sold" });
    }

    await Cart.destroy({
  where: {
    user_id: transaction.user_id,
    book_id: { [Op.in]: transaction.book_ids },
  },
});
    
    await transaction.update({
      status: "COMPLETED",
      esewa_transaction_code: decodedData.transaction_code,
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?transactionId=${transaction.id}`,
    );
  } catch (err) {
    console.error("eSewa verification failed:", err.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
};

const esewaFailure = async (req, res) => {
  try {
    const { data } = req.query;
    if (data) {
      const decodedData = JSON.parse(Buffer.from(data, "base64").toString());
      await Transaction.update(
        { status: "FAILED" },
        { where: { transaction_uuid: decodedData.transaction_uuid } },
      );
    }
  } catch (err) {
    console.error("Failure handler error:", err.message);
  }

  res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
};

module.exports = { initializeEsewa, esewaSuccess, esewaFailure };
