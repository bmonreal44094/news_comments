const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      router = express.Router(),
      axios = require("axios"),
      cheerio = require("cheerio"),
      db = require("./models"),
      PORT = 8080,
      app = express(),
      exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news-comments", {
  useMongoClient: true
});

app.get('/', function (req, res) {
  res.redirect("articles");
  console.log("Hello World Console");
});

app.get("/scrape", function(req, res) {
  axios.get("http://www.foxnews.com/us.html").then(function(response) {
    let $ = cheerio.load(response.data);
    $("article div").each(function(i, element) {
      let result = {};
      result.title = $(this)
        .find("h2").children("a")
        .text();
      result.link = $(this)
        .find("h2").children("a")
        .attr("href");
      result.blurb = $(this)
        .find("p").children("a")
        .text();

      db.Article
        .create(result)
        .then(function(dbArticle) {
          res.redirect("/articles");
      // })
      //   .catch(function(err) {
      //     res.json(err);
      });
    });
  });
});

app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      let hbsObject = {
        data: dbArticle
      };
      // console.log(hbsObject);
      res.render("articles", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      let hbsObject = {
        data: dbArticle
      };
      // console.log(hbsObject);
      res.render("saved", hbsObject);
      // res.json(hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/saved/:id", function(req, res) {
  console.log(req.params.id);
  db.Article.update({_id:req.params.id}, {$set: {saved:false}})
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
