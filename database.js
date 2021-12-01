const books = [
    {
        ISBN: "12345Book",
        title: "Getting started with MERN",
        pubDate: "2021-11-30",
        language: "en",
        numPage: "250",
        author: [1,2],
        publications: [1],
        category: ["tech", "programming", "science"]
    }
];

const author = [
    {
        id: 1,
        name: "Vedha",
        books: ["12345Book", "MyBook"]
    },
    {
        id: 2,
        name: "Aradhana",
        books: ["12345Book"]
    }
];

const publication = [
    {
        id: 1,
        name: "Writex",
        books: ["12345Book"]
    }
];

module.exports = {books, author, publication};