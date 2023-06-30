const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
const currentUser= users.filter(x=>x.username===username && x.password===password);
if(currentUser && currentUser.length>0)
{
    return true;
}
else{
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;
  if(!username || !password)
  {
      return res.status(404).json({message:"error logging in!"});
  }
  if(authenticatedUser(username,password))
  {
     const accessToken= jwt.sign({data: password},'access', {expiresIn:60*60});
     req.session.authorization={accessToken,username};
     return res.status(200).send('user successfully logged in.');
  }
  else{
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn= req.params.isbn;
  if(isbn)
  {
  const currentBook= books[isbn];
  const user=req.user;
  const existingReview= currentBook.review[user];
  if(existingReview && existingReview>0)
  {
    existingReview=req.body.review;
    return res.status(200).send("Book review successfully updated.");
  }
  else{
    currentBook.review.push({user:req.body.review});
    return res.status(200).send("Book review successfully added.");
  }
}
else{
    return res.status(404).json({message:"failed to add review."});
}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
