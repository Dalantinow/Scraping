const express = require("express");
const exphbs = require("express-handlebars")
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
let PORT = 3000;
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.get('/', function (req, res) {
    res.render('index');
});

app.get("/scrape", (req, res) => {
    axios.get("https://old.reddit.com/r/news/").then(response => {
        let $ = cheerio.load(response.data);
        let results = {}
        $("p.title").each(function(i, element) {
           results.title = $(this).children("a").text();
           results.link = $(this).children("a").attr("href");
        db.Article.create(results).then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        });
        res.send("Scraped");
    });
});
app.get("/notes", (req, res) => {
    db.Note.find().then(dbNote => res.json(dbNote))
    .catch(err =>res.json(err));
});

app.get("/headlines", (req, res) => { 
    db.Article.find().then(dbArticle =>
    res.json(dbArticle))
    .catch(err => res.json(err));
});

app.get("/headlines/:id", (req, res) => {
    db.Article.findOne({_id: req.params.id}).populate("note")
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err));
});

app.post("/headlines/:id", (req, res) => {
    db.Note.create(req.body).then(dbNote => 
        db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
    )
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err));
});

app.listen(PORT, () => console.log("App running on port: " + PORT))