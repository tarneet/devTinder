const express = require("express");

const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllUsers", (req,res) => {
    res.send("All data sent");
});

app.delete("/admin/deleteUser", (req,res) => {
    res.send("Deleted a user");
});


app.get("/users",userAuth, (req,res) => {
    res.send("Users api called");
});

// Handling errors
app.get("/getUsers",userAuth, (req,res) => {
    try {
        // Logic to get data from db
        throw new Error("ddfddffdwwww");
    } catch(err) {
        res.status(500).send("Some error contact support team");
    }
});

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Something went wrong");
    }
});


app.listen(4004, () => {
    console.log("Server listening at port 4004...")
});