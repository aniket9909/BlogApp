var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
var methodOverride = require("method-override")
var app = express()


mongoose.connect("mongodb://localhost/blog_v09")
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
var blogschema = new mongoose.Schema({
    name: String,
    image: String,
    body: String,
    create: { type: Date, default: Date.now }
})

var Blog = mongoose.model("blog", blogschema);

// Blog.create({
//     name:"aniket",
//     image:"https://pixabay.com/get/g301c23855660b2a4c8e51852496edd793d949e33b538752668af05954cadca64fc5191260641c9f68a53d41f2c887e40_340.jpg",
//     body:"nice dog"
// },(err,dog)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log(dog);
//     }
// })

app.get("/", (req, res) => {
    res.render("index.ejs")
})
//show all blogs
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("something wrong");
        } else {
            // console.log(blogs);
            res.render("index.ejs", { blog: blogs })
        }
    })
})

// create new blog
app.get("/blog/new", (req, res) => {
    res.render("new.ejs")
})
//create new blog using post request
app.post("/blogs", (req, res) => {
    // var blog = req.body.blog;
    // console.log(blog);
    Blog.create(req.body.blog, (err, newblog) => {
        if (err) {
            console.log("something went wrong");
            res.render("new.ejs")
        } else {
            res.redirect("/blogs")
        }
    })
})

//show blog separetly
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, show) => {
        if (err) {
            console.log("something went wrong");
        } else {
            res.render("show.ejs", { blog: show })
        }
    })
})
//update or edit blog post
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundblog) => {
        if (err) {
            console.log("something went wrong");
            res.render("/blogs")
        } else {
            res.render("edit.ejs", { blog: foundblog })
        }
    })
})

app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateblog) => {
        if (err) {
            console.log("something went wrong");
            res.render("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//remove the blog

app.delete("/blog/:id", (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.redirect("/blogs")
            console.log(err);
        } else {
            res.redirect("/blogs")
            console.log("post deleted" + req.params.id);
        }
    })
})
app.listen("3000", () => {
    console.log("server are running");
})