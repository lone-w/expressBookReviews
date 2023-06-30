const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExits= (userName) =>
{
    const userWithSameName= users.filter(x=>x.username===userName);
    if(userWithSameName && userWithSameName.length>0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;
  if(username && password)
  {
if(!doesExits(username))
{
    users.push({'username':username,'password':password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
}
else
{
    return res.status(404).json({message: "User already exists."});
}
  }
  else
  {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
          resolve(JSON.stringify(books,null,4));
        });
        myPromise.then(x=>{
            res.send(x);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   
    if(req?.params?.isbn)
    { 
        let bookPromise = new Promise((resolve,reject) => {
        const filteredBooks= books[req.params.isbn];
        resolve(filteredBooks);
          });
        bookPromise.then(x=>{
            res.send(x);
        });
    }
    else
    { return res.status(404).json({message: "Requested book not found"});
    }
 });
 const filterByAuthor = (author) => {
    return Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
  };
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    if(req?.params?.author)
    { 
        let bookPromise = new Promise((resolve,reject) => {            
    const filteredBooks= filterByAuthor(req?.params?.author);
            resolve(filteredBooks);
              }); 
              bookPromise.then(book=>{
                res.send(JSON.stringify(book,null,4));
              });    
    }
    else
    { return res.status(404).json({message: "Requested book not found"});
    }
});
const filterByTitle = (title) => {
    return Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  };
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    if(req?.params?.title)
    {     
        let bookPromise = new Promise((resolve,reject) => {            
            const filteredBooks= filterByTitle(req?.params?.title);
                    resolve(filteredBooks);
                      }); 
                      bookPromise.then(book=>{
                        res.send(JSON.stringify(book,null,4));
                      });    
    }
    else
    { return res.status(404).json({message: "Requested book not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    if(req?.params?.isbn)
    {
    const filteredBooks= books[req.params.isbn];
    res.send(JSON.stringify(filteredBooks.reviews,null,4));
    }
    else
    { return res.status(404).json({message: "Requested book not found"});
    }
 
});

module.exports.general = public_users;
