const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Book = require("../models/bookModel");
const Address = require("../models/addressModel");

const createOrder = async (req, res) => {
  try {
    const loggedId = req.user.userId;
    if (!loggedId) {
      return res.status(401).json({ message: "Please login first" });
    }
    const { bookIds, address_id } = req.body;

    const address = await Address.findByPk(address_id);

    let totalPrice = 0;
    const books = [];
    for (const bookId of bookIds) {
      const book = await Book.findOne({ where: { id: bookId } });

      ("Checking book ID:", bookId);
      ("Book status in DB:", book ? book.status : "not found");

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.status == "Sold") {
        return res.status(400).json({ message: "Book is already sold" });
      }
      totalPrice += book.price;
      books.push(book);
    }
    const order = await Order.create({
      buyer_id: loggedId,
      total_price: totalPrice,
      status: "Pending",
      delivery_street: address?.street,
      delivery_city: address?.city,
      delivery_district: address?.district,
      delivery_province: address?.province,
    });

    for (const book of books) {
      const orderItem = await OrderItem.create({
        order_id: order.id,
        book_id: book.id,
        price: book.price,
      });
      await book.update({ status: "Sold" });
    }
    return res.status(201).json({ message: "Order created succesfully" });
  } catch (error) {
    ("Order error:", error);
    return res.status(500).json({ message: "Server error on order" });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const loggedId = req.user.userId;
    if (!loggedId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const orders = await Order.findAll({
      where: { buyer_id: loggedId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Book,
              attributes: ["title", "price"],
            },
          ],
        },
      ],
    });

    if (orders.length === 0) {
      return res.status(200).json({ message: "You have no orders yet" });
    }
    return res.status(200).json({ orders });
  } catch (error) {
    ("Error in createOrder:", error.message);
    ("Full error:", error);
    return res.status(500).json({ message: "Server error on my order" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const loggedId = req.user.userId;
    const id = req.params.id;
    if (!loggedId) {
      return res.status(401).json({ message: "Please login first" });
    }
    const orders = await Order.findOne({
      where: { id: id },
      include: [OrderItem],
    });

    if (!orders) {
      return res.status(404).json({ message: "You have no orders yet" });
    }

    if (orders.buyer_id !== loggedId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Server error on get order by id" });
  }
};

const getMySales = async (req, res) => {
  const seller = req.user.userId;
  try {
    if (!seller) {
      return res.status(403).json({ message: "Please login first" });
    }

    const sales = await Order.findAll({
      include: [
        {
          model: OrderItem,
          required: true,
          include: [
            {
              model: Book,
              where: { seller_id: seller },
              attributes: ["id", "title", "price", "coverImage"],
            },
          ],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (sales.length === 0) {
      return res.status(200).json({ sales: [] });
    }

    return res.status(200).json({ sales });
  } catch (error) {
    error;
    return res.status(500).json({ message: "Server error on get my sales" });
  }
};
module.exports = { createOrder, getMyOrder, getOrderById, getMySales };
