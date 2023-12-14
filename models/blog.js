const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/blogs")
    .then(() => {
        console.log("DB connection has been succesful");
    })
    .catch((err) => {
        console.log(`DB connection error: ${err}`)
    });

// we create Schema and convert it into a model
const blogSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    description: String,
}, { collection: "doc" });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;