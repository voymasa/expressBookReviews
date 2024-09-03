const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({
      message: "Error logging in"
    });
  }

  if(authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).send("User successfully logged in");
  }
  return res.status(208).json({
    message: "Invalid login. Check username and password"
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log("adding review");
  const user = req.user;
  const isbn = parseInt(req.params.isbn);
  const review = req.query.review;
  const reviews = books[isbn].reviews;
  reviews[user] = review;

  //console.log("User: " + user + "\nisbn " + isbn )
  
  return res.status(200).json({message: "Review added"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
