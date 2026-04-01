const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Book = require("../models/bookModel");

const createOrder = async (req, res) => {
  try {
    const loggedId = req.user.userId;
    if (!loggedId) {
      return res.status(401).json({ message: "Please login first" });
    }
    const { bookIds } = req.body;

    let totalPrice = 0;
    const books = [];
    for (const bookId of bookIds) {
      const book = await Book.findOne({ where: { id: bookId } });
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
      status: "pending",
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
    return res.status(500).json({ message: "Server error on order" });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const loggedId = req.user.userId;
    if (!loggedId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const book = await Order.findAll({ where: { buyer_id: loggedId} });
    return res.status(200).json({book});
  } catch (error) {
    return res.status(500).json({ message: "Server error on my order" });
  }
};
module.exports = {createOrder, getMyOrder};
