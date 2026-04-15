const User = require("./userModel");
const Book = require("./bookModel");
const Cart = require("./cartModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");

/* Relationships */

// User sells books
User.hasMany(Book, { foreignKey: "seller_id" });
Book.belongsTo(User, { foreignKey: "seller_id" });

// User places orders
User.hasMany(Order, { foreignKey: "buyer_id" });
Order.belongsTo(User, { foreignKey: "buyer_id" });

// Order contains items
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Each order item references a book
Book.hasMany(OrderItem, { foreignKey: "book_id" });
OrderItem.belongsTo(Book, { foreignKey: "book_id" });

User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });
Cart.belongsTo(Book, { foreignKey: "book_id" });
Book.hasMany(Cart, { foreignKey: "book_id" });

module.exports = {
  User,
  Book,
  Cart,
  Order,
  OrderItem
};