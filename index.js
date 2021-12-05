require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended :true}));
booky.use(bodyParser.json());

//Establish Database Connection
mongoose.connect(
    process.env.MONGO_URL
).then(()=> console.log("Connection Established!!!"));

//GET ALL BOOKS
/*
Route           /
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/

booky.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /is
Description     Get specific book
Access          Public
Parameter       isbn 
Methods         GET
*/

booky.get("/is/:isbn", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook) {
        return res.json({
            error: `No book found for ISBN of ${req.params.isbn}`
        });
    }

    return res.json(getSpecificBook);
});

//GET BOOKS on a specific category
/*
Route           /c
Description     Get specific book by category
Access          Public
Parameter       category
Methods         GET
*/

booky.get("/c/:category", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category});

    if(!getSpecificBook) {
        return res.json({
            error: `No book found for category of ${req.params.category}`
        });
    }

    return res.json(getSpecificBook);
});

//GET BOOKS based on languages
/*
Route           /l
Description     Get specific book by language
Access          Public
Parameter       language
Methods         GET
*/

booky.get("/l/:language", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.language});
    
    if(!getSpecificBook) {
        return res.json({
            error: `No book found for category of ${req.params.language}`
        });
    }

    return res.json(getSpecificBook);
});

//GET ALL AUTHORS
/*
Route           /author
Description     Get all authors
Access          Public
Parameter       NONE
Methods         GET
*/

booky.get("/author", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

//GET ALL AUTHORS BASED ON A PARTICULAR BOOK
/*
Route           /author/book
Description     Get all authors based on book
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/author/book/:isbn", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn});

    if(!getSpecificAuthor) {
        return res.json({
            error: `No author found for ISBN of ${req.params.isbn}`
        });
    }

    return res.json(getSpecificAuthor);

});

//GET SPECIFIC AUTHOR BASED ON NAME
/*
Route           /author
Description     Get all authors based on name
Access          Public
Parameter       name
Methods         GET
*/

booky.get("/author/:name", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({name: req.params.name});

    if(!getSpecificAuthor) {
        return res.json({
            error: `Author named ${req.params.name} is not found`
        });
    }

    return res.json(getSpecificAuthor);
});

//GET ALL PUBLICATIONS
/*
Route           /publications
Description     Get all publications
Access          Public
Parameter       NONE
Methods         GET
*/

booky.get("/publications", async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

//GET SPECIFIC PUBLICATION BASED ON NAME
/*
Route           /publications
Description     Get all publications based on name
Access          Public
Parameter       name
Methods         GET
*/

booky.get("/publications/:name", async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({name: req.params.name});

    if(!getSpecificPublication) {
        return res.json({
            error: `No publication found with name ${req.params.name}`
        });
    }

    return res.json(getSpecificPublication);
});

//GET LIST OF PUBLICATIONS BASED ON BOOK
/*
Route           /publications
Description     Get all publications based on ISBN
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/publications/book/:isbn", async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({book: req.params.isbn});

    if(!getSpecificPublication) {
        return res.json({
            error: `No publication found with name ${req.params.isbn}`
        });
    }

    return res.json(getSpecificPublication);
});

//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", (req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthors: database.author});
});

//ADD NEW PUBLICATIONS
/*
Route           /publications/new
Description     add new publications
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublications: database.publication});
});

//UPDATE PUB AND BOOK
/*
Route           /publication/update/book
Description     update the pub and book
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    //UPDATE THE PUB DB
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    //UPDATE THE BOOK DB
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated!"
        }
    )
});

//DELETE A BOOK
/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    const UpdateBookDataBase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn 
    )

    database.books = UpdateBookDataBase;

    return res.json({books: database.books});
});

//DELETE AN AUTHOR FROM A BOOK AND VICE VERSA
/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          Public
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //update the book db
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    //update author db
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author and book were deleted!!!"
    });

});

booky.listen(3000, () => console.log("Server is up and running!!"));