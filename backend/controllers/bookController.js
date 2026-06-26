const supabase = require("../config/supabase");
const BookImage = require("../models/bookImageModel");
const Book = require("../models/bookModel");
const { User } = require("../models");
const { Op } = require("sequelize");

const addBook = async (req, res) => {
  try {
    const seller_id = req.user.userId;
    if (!seller_id) {
      return res.status(401).json({ message: "Seller nor found" });
    }
    const { title, author, price, condition, description } = req.body;
    const normalizedTitle = title.trim().toLowerCase();

    const check = await Book.findOne({
      where: {
        seller_id: req.user.userId,
        title: { [Op.iLike]: normalizedTitle },
      },
    });

    if (check) {
      return res.status(400).json({ message: "Book exists already" });
    }

    const book = await Book.create({
      title,
      author,
      price,
      condition,
      description,
      seller_id,
    });

    return res
      .status(201)
      .json({ message: "Book added succesfully", book: book });
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

const uploadBookImages = async (req, res) => {
  try {
    ("=== uploadBookImages DEBUG ===");
    ("req.file exists?", !!req.file);
    ("req.body:", req.body);
    ("slot value:", req.body.slot);
    ("slot type:", typeof req.body.slot);
    ("book_id value:", req.body.book_id);

    const userId = req.user.userId;
    const file = req.file;
    const { book_id, slot } = req.body;

    ("Validation checks:");
    ("!file?", !file);
    ("!slot?", !slot);
    ("slot < 1?", slot < 1);
    ("slot > 5?", slot > 5);
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!slot || slot < 1 || slot > 5) {
      return res.status(400).json({ message: "Invalid slot (1-5)" });
    }

    // Find book
    const book = await Book.findOne({ where: { id: book_id } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller_id !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    `Uploading image for slot ${slot}`;

    // ========== UPLOAD TO SUPABASE ==========
    const { data, error } = await supabase.storage
      .from("book-images")
      .upload(`books/${book_id}/image-${slot}.jpg`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      ("Supabase error:", error);
      return res.status(400).json({
        message: "Upload Failed",
        error: error.message,
      });
    }

    `Image for slot ${slot} uploaded to Supabase`;

    // ========== GET PUBLIC URL ==========
    const { data: urlData } = supabase.storage
      .from("book-images")
      .getPublicUrl(`books/${book_id}/image-${slot}.jpg`);

    const imageUrl = urlData.publicUrl;

    // ========== SAVE TO DATABASE ==========
    // Check if image already exists for this slot
    const existingImage = await BookImage.findOne({
      where: {
        book_id: book_id,
        order: parseInt(slot),
      },
    });

    if (existingImage) {
      // Update existing image
      await existingImage.update({ image_url: imageUrl });
      `Updated existing image in slot ${slot}`;
    } else {
      // Create new image
      await BookImage.create({
        book_id: book_id,
        image_url: imageUrl,
        order: parseInt(slot),
      });
      `Created new image in slot ${slot}`;
    }

    return res.status(201).json({
      message: "Image uploaded successfully",
      slot: slot,
      imageUrl: imageUrl,
    });
  } catch (error) {
    ("Upload error:", error.message);
    return res.status(500).json({
      message: "Server error on image upload",
      error: error.message,
    });
  }
};

const deleteBookImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.userId;

    ("Deleting image:", imageId);

    // Find image
    const image = await BookImage.findOne({ where: { id: imageId } });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Find book to check authorization
    const book = await Book.findOne({ where: { id: image.book_id } });

    if (!book || book.seller_id !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete from Supabase
    const bookId = image.book_id;
    const order = image.order;

    try {
      await supabase.storage
        .from("book-images")
        .remove([`books/${bookId}/image-${order}.jpg`]);

      ("File deleted from storage");
    } catch (error) {
      ("Storage delete error:", error);
      // Continue even if storage delete fails
    }

    // Delete from database
    await image.destroy();

    ("Image deleted from database");

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    ("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereClause = { status: "Available" };

    // Exclude logged-in user's own books
    if (req.user?.userId) {
      whereClause.seller_id = { [Op.ne]: req.user.userId };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [{ model: User, attributes: ["name"] }],
    });

    return res.status(200).json({
      book: rows,
      totalBooks: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error on get all books" });
  }
};

const getBookbyId = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: BookImage,
          attributes: ["id", "image_url", "order"],
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const coverUrl = supabase.storage
      .from("book-covers")
      .getPublicUrl(`${book.id}/cover.jpg`);

    return res.status(200).json({
      ...book.toJSON(),
      coverImage: coverUrl.data.publicUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const editBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!bookId) {
      return res.status(404).json({ message: "Book not found" });
    }

    const seller_id = req.user.userId;
    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller_id !== seller_id) {
      return res
        .status(403)
        .json({ message: "Not authourized to edit this book" });
    }

    const updatedBook = req.body;
    await book.update(updatedBook);
    return res.status(200).json({ message: "Book updated succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error on book update" });
  }
};

const getMyBooks = async (req, res) => {
  try {
    const loggedId = req.user.userId;
    if (!loggedId) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    const books = await Book.findAll({
      where: { seller_id: loggedId },
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (books.length === 0) {
      return res.status(200).json({ message: "No books listed" });
    }
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Server error on getmybook" });
  }
};

const getBooksBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const books = await Book.findAll({
      where: { seller_id: sellerId },
      attributes: { exclude: ["seller_id", "createdAt", "updatedAt"] },
    });

    if (books.length === 0) {
      return res.status(200).json({ message: "No books found" });
    }

    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Server error on getbookbyseller" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const loggedIn = req.user.userId;
    const bookId = req.params.id;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    if (!loggedIn) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const book = await Book.findOne({ where: { id: bookId } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller_id !== loggedIn) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }
    await book.destroy();
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const uploadCoverImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;
    const { book_id } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find book
    const book = await Book.findOne({ where: { id: book_id } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller_id !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("book-covers")
      .upload(`${book_id}/cover.jpg`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      return res.status(400).json({
        message: "Upload failed",
        error: error.message,
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("book-covers")
      .getPublicUrl(`${book_id}/cover.jpg`);

    // Update book
    await book.update({ coverImage: urlData.publicUrl });

    return res.status(200).json({
      message: "Cover image updated",
      coverImage: urlData.publicUrl,
    });
  } catch (error) {
    ("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCoverImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;

    // Find book
    const book = await Book.findOne({ where: { id: bookId } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller_id !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete from Supabase
    try {
      await supabase.storage
        .from("book-covers")
        .remove([`${bookId}/cover.jpg`]);
    } catch (error) {
      ("Storage delete error:", error);
    }

    // Clear from database
    await book.update({ coverImage: null });

    return res.status(200).json({ message: "Cover image deleted" });
  } catch (error) {
    ("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  addBook,
  uploadBookImages,
  uploadCoverImage,
  deleteCoverImage,
  deleteBookImage,
  getAllBooks,
  getBookbyId,
  editBook,
  getMyBooks,
  getBooksBySeller,
  deleteBook,
};
