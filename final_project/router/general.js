const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// const userExists = (username) => {
//   let matchingUsers = users.filter((user) => {
//     return user.username === username;
//   });

//   if(matchingUsers.length > 0) {
//     return true;
//   }
//   return false;
// }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // check if username already exists
  if(username && password) {
    if(!isValid(username)) {
      users.push({
        "username": username,
        "password": password
      });
      return res.status(200).json({
        message: "User registered."
      });
    } else {
      return res.status(404).json({
        message: "User already exists"
      });
    }
  }
  // register user
  return res.status(404).json({message: "Unable to register user. Username or password missing."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  const req = axios.get(`${BASE_URL}/`);
  req.then(resp => {
    return resp.status(200).send(JSON.stringify(
      books,
      null,
      4
    ));
  })
  .catch(err => {
    return err.status(404).json({
      message: "No books found"
    });
  });
  // return res.status(200).send(JSON.stringify(
  //   books,
  //   null,
  //   4
  // ));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  return res.status(200).send(JSON.stringify(
    book,
    null,
    4
  ));
});

// get book details with axios
const getBookByIsbnWithAxios = (isbn) => {
  const req = axios.get('/isbn/{isbn}');
  req.then(resp => {
    return response.data;
  })
  .catch(err => {
    return err.toString();
  });
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  //get keys
  // iterate and find author
  const keys = Object.keys(books);

  for(let key in keys) {
    if(books[parseInt(keys[key])].author === author) {
      return res.status(200).send(JSON.stringify(
        books[keys[key]],
        null,
        4
      ));
    }
  }
  
  return res.status(404).json("No book by that author");
});

const getBookByAuthorWithAxios = (author) => {
  const req = axios.get('/author/{author}');
  req.then(resp => {
    return resp.data;
  })
  .catch(err => {
    return err.toString();
  });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  for(let [key, value] of Object.entries(books))
  {
    if(value.title === title) {
      return res.status(200).send(JSON.stringify(
        books[key],
        null,
        4
      ));
    }
  }

  return res.status(404).json({message: "No book by that title"});
});

// get book by title with axios
const getBookByTitleWithAxios = (title) => {
  const req = axios.get('/title/{title}');
  req.then(resp => {
    return resp.data;
  })
  .catch(err => {
    return err.toString();
  });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;
  if(review) {
    return res.status(200).send(JSON.stringify(
      {review},
      null,
      4
    ));
  } else {
    return res.status(404).json({message: "No reviews for that book"});
  }
});

module.exports.general = public_users;
