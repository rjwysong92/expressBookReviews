const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if(!isValid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using synchronous callback
public_users.get('/',(req, res) => {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN using synchronous callback
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author using synchronous callback
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    res.send(books[author])
});

// Get all books based on title using synchronous callback
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    res.send(books[title])
});

//  Get book review using synchronous callback
public_users.get('/review/:isbn',function (req, res) {
    const review = req.params.isbn;
    res.send(books[review])
});

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/async-get-books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

// TASK 11 - Get the book details based on ISBN using promises
public_users.get('/async-get-book-by-isbn/:isbn', function (req, res) {
    
    const get_by_isbn = new Promise((resolve, reject) => {
        
        let booksbyisbn = [];
        let isbn = Object.keys(books);
        isbn.forEach((isbn) => {
            if(books[isbn]["isbn"]) = req.params.isbn) {
                booksbyisbn.push({
                    "isbn": isbn,
                    "title": books[isbn]["title"],
                    "author": books[author]["author"]});    
    
        resolve(res.send(JSON.stringify({booksbyisbn}, null, 4)));
    }});
    
    get_by_isbn.then(() => console.log("Promise for Task 11 resolved"))
});

// TASK 12 - Get book details based on author
public_users.get('/books/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }


    });
    reject(res.send("The mentioned author does not exist "))
        
    });

    get_books_author.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });

  });



module.exports.general = public_users;
