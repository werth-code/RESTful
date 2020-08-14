//App Config - Dependencies 

const e = require('express');

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      port = 3000

      
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))

//Mongoose / Model Config

let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
})

const Blog = mongoose.model("Blog", blogSchema)

//RESTful Routes

// Blog.create({
//   title: "Test Blog",
//   image: "https://ichef.bbci.co.uk/news/1024/cpsprodpb/C271/production/_98677794_gettyimages-486869012.jpg",
//   body: "THIS IS A POST"
// });

//INDEX ROUTE

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) console.log("Error!")
        else res.render("index", {blogs: blogs})
    })
})

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new")
})

//CREATE ROUTE
app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if(err) res.render("new")
    else res.redirect("/blogs")
  })
})

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) console.log('ERROR')
    else res.render("show.ejs", { blog: foundBlog })
  })
})

//EDIT ROUTE

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) res.redirect("/blogs")
    else res.render("edit", {blog: foundBlog})
  })
})

//UPDATE ROUTE

app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err) res.redirect("/blogs")
    else res.redirect("/blogs/" + req.params.id)
  })
})

//DELETE ROUTE

app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if(err) res.redirect("/blogs")
    else res.redirect("/blogs");
  })
})

//LISTEN AT PORT..
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);