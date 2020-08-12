//App Config

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      port = 3000
      
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

//Mongoose / Model Config

let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
})

const Blog = mongoose.model("Blog", blogSchema)

//RESTful Routes

Blog.create({
  title: "Test Blog",
  image: "https://ichef.bbci.co.uk/news/1024/cpsprodpb/C271/production/_98677794_gettyimages-486869012.jpg",
  body: "THIS IS A POST"
});

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) console.log("Error!")
        else res.render("index", {blogs: blogs})
    })
})


app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);