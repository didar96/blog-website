const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();


const aboutContent = " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem ";
const contactContent = " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem ";


mongoose.connect("mongodb+srv://admin-didar:Test123@cluster0.bwbxa.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {title: String, content: String, author: String, date: String};
const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
    Post.find({}, function (err, postArray) {
        res.render("home", {posts: postArray});
    })
    
});

app.get("/about", function (req, res) {
    res.render("about", {about: aboutContent});
});

app.get("/contact", function (req, res) {
    res.render("contact", {contact: contactContent});
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    
    const date = new Date();
    const dateString = date.toLocaleString("default", {month: "long", year: "numeric", day: "numeric"});
    const post = new Post({title: req.body.postTitle, content: req.body.postContent, author: req.body.postAuthor, date: dateString});
    post.save(function (err) {
        if(!err) {
            res.redirect("/");
        };
    });
    
});

app.get("/posts/:postId", function (req, res) {

    Post.findById(req.params.postId, function (err, post) {
        res.render("post", {mainPost: post});
    });

});

app.post("/delete/:postId", function (req, res) {
    
    Post.findByIdAndRemove(req.params.postId, function (err) {
        if (!err) {
            res.redirect("/");
        };
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server has started successfully.");
});