const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

    try {

        // creating a new instance of user model
        const user = new User(req.body);

        // const user = new User({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     emailId: req.body.emailId,
        //     password: req.body.password,
        // });

        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user: "+ err.message);
    }


})

connectDB()
.then(() => {
    console.log("Database connection established...");
    app.listen(4004, () => {
        console.log("Server listening at port 4004...")
    });
}).catch((err) => {
    console.error("Database cannot be connected");
});