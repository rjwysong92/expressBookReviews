const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
     return (user.username === username && user.password === password)
   });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.regd_users;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
    }
    res.send(`The review for the book with ISBN ${isbn} has been added/updated!`);
  } 
  else{
      res.send("Unable to find this ISBN!");
  }
});

// Delete a book reivew done only by specific authorized user
regd_users.delete("/auth/review/:isbn", (req, res)=>{
    const isbn = req.params.isbn;
    const user = req.session.authorization["username"];
    delete books[isbn]["reviews"][user];
    res.send("Delete success!")
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
