const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Respond with the list of books
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Fetch the list of books using async-await
public_users.get("/books-async", async (req, res) => {
    try {
      const response = await axios.get("http://localhost:5000/");
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      // Respond with the book details
      return res.status(200).json(books[isbn]);
    } else {
      // ISBN not found
      return res.status(404).json({ message: "Book not found with the provided ISBN" });
    }
});

// Fetch book details based on ISBN using async-await
public_users.get('/isbn-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).json({ message: "Book not found with the provided ISBN", error: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from the request parameters
    const author = req.params.author;
  
    // Filter the books to find all books by the provided author
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      // Respond with the filtered books
      return res.status(200).json(booksByAuthor);
    } else {
      // If no books by the author were found
      return res.status(404).json({ message: "No books found for the given author" });
    }
});

// Fetch book details based on author using async-await
public_users.get('/author-async/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found for the given author", error: error.message });
    }
});
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from the request parameters
    const title = req.params.title;
  
    // Filter the books to find books matching the provided title
    const booksByTitle = Object.values(books).filter(book => book.title === title);
  
    if (booksByTitle.length > 0) {
      // Respond with the filtered books
      return res.status(200).json(booksByTitle);
    } else {
      // If no books match the title
      return res.status(404).json({ message: "No books found with the given title" });
    }
});

// Fetch book details based on title using async-await
public_users.get('/title-async/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found with the given title", error: error.message });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      // Respond with the book's review
      return res.status(200).json({ reviews: books[isbn].reviews || "No reviews available for this book" });
    } else {
      // ISBN not found
      return res.status(404).json({ message: "Book not found with the provided ISBN" });
    }
});

module.exports.general = public_users;
