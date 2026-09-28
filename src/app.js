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


app.listen(4004, () => {
    console.log("Server listening at port 4004...")
});