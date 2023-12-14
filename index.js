console.log("node app is running");

/*
go to the package.json and specify a "start path"
so you don't have to jump from here and there in order
to start the server

go to script, and replace "test" with 
"start": "node src/index.js"

now, in order to start the application
enter "npm start" in the terminal
*/

// import mongoose
// const mongoose = require("./db/mongoose");

// importing express
const express = require("express");

// importing model 
const Blog = require("./models/blog");

// store the express app in a constant

const app = express();
// middleware to work with json
app.use(express.json());

// routing ("/")
app.get("/", (req, res) => {
    res.send("hello there!");
});

// about
app.get("/about", (req, res) => {
    res.send("<h1>about page</h1>")
});

// services
const info = {
    name: "José",
    designation: "Backend developer",
    country: "Argentina"
}

app.get("/services", (req, res) => {
    res.send(JSON.stringify(info));
});

// contact + id
app.get("/contact", (req, res) => {
    res.send("<h1>contact page</h1>");
});

app.get("/contact/:id", (req, res) => {
    res.send(`information of contact ${req.params.id} requested`);
});

// let's post (to understand how to construct documents)
// let's save by instancing our model
// remember, we use await after getting the promise object
app.post("/blogs", async (req, res) => {
    /*
    const newBlog = new Blog(req.body);
    // we save, and state what happens if everything works or fails
    newBlog.save().then((blog) => {
        res.status(201).send(blog); // if everything works 
    }).catch((error) => {
        res.status(400).send(error); // if everything fails
    })
    */

    /* 
   try {
    const newBlog = new Blog(req.body); 
    await newBlog.save();
    res.json(newBlog);
   }
   catch (error) {
    res.status(400).send(error);
   }
   */ 

   // let's save out document with create()

   /*
   try {
    await Blog.create(req.body); 
    res.json(req.body);
   }
   catch (error) {
    res.status(400).send(error);
   }
   */

    // or, for inserting large batches of documents - we send them in between brackets --- > [{"this": "hey"}, {"that": "heyy"}]
    /*
    try {
        await Blog.insertMany(req.body); 
        res.json(req.body);
    }
    catch (error) {
        res.status(400).send(error);
    }
    */
    // I'll keep this one here (save)
    try {
        const newBlog = new Blog(req.body); 
        await newBlog.save();
        res.json(newBlog);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

// retrive all documents from mongodb
app.get("/blogs", async (req, res) => {

    /*
    Blog.find({}).then((blogs) => {
        res.json(blogs);
    }).catch((error) => {
        res.status(500).send(error);
    });
    */

    // async - await version

    try {
        const blogs = await Blog.find({}); 
        res.json(blogs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// retrive a single doc by id
app.get("/blogs/:id", /*async*/ (req, res) => {
    /*
    try {
        // get id
        const id = req.params.id; 
        // find blog with findById
        const blog = await Blog.findById(id);

        if (!blog) {
            const error = new Error("blog not found");
            error.status(404);
            throw error;
        }
        res.json(blog);
    }
    catch (error) {
        res.status(400).send(error);
    }
    */
    // another way 
    /*
    Blog.findById(req.params.id).then((blog) => {
        if(!blog) {
            res.status(404).send("blog not found");
        }
        res.json(blog);
    }).catch((error) => {
        res.status(400).send(error);
    });
    */
    // yet another way - with findOne (it's slightly different)
    Blog.findOne({_id: req.params.id}).then((blog) => {
        if (!blog) {
            return res.status(404).send("blog not found");
        }
        res.json(blog);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// update (patch) - update certain parameters of the object
app.patch("/blogs/:id", async (req, res) => {
    /*
    Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((blog) => {
        if(!blog) {
            return res.status(404).send("unable to update blog - not found");
        }
        res.json(blog);
    }).catch((error) => {
        res.status(500).send(error);
    });
    */
    
    // using "update one" - returns a message instead of the updated object

    /*
    Blog.updateOne({_id: req.params.id}, req.body).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(500).send(error);
    });
    */

    // async - await version
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(blog); 
    } catch (error) {
        res.status(500).send(error);
    }
});

// update (put) - replaces the whole object
app.put("/blogs/:id", async (req, res) => {
    /*
    Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((blog) => {
        if (!blog) {
            return res.status(404).send("unable no update blog - not found");
        }
        res.json(blog);
    }).catch((error) => {
        res.status(500).send(error);
    });
    */

    // async - await version
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).send(error);
    }
});

// delete by id 
app.delete("/blogs/:id", async (req, res) => {
    /*
    Blog.findByIdAndDelete(req.params.id).then((blog) => {
        if (!blog) {
            return res.status(404).send("unable to delete blog - not found");
        }
        res.json({ message: "blog deleted" });
    }).catch((error) => {
        res.status(500).send(error);
    });
    */

    // async - await version
    try {
        await Blog.findByIdAndDelete(req.params.id); 
        res.status(200).json({ mensaje: "blog has been deleted succesfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

// start listening 
const PORT_3000 = process.env.PORT || 3000; 

app.listen(PORT_3000, () => {
    console.log(`server listening in http://localhost:${PORT_3000}`);
}); 