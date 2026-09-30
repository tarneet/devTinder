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
        res.status(400).send("Something went wrong!");
    }


});

// get all users from db
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong!");
    }

});


// delete user
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong!");
    }

});

// update user
app.patch("/user/:userId", async (req, res) => {
    try {

        const userId = req.params?.userId;
        const data = req.body;

        const ALLOWED_UPDATE = [
            "firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATE.includes(k)
        );

        if(!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true    //   run validations(if any)
        });
        res.send(user);
    } catch (err) {
        res.status(400).send("Update Failed: " + err.message);
    }

});

connectDB()
.then(() => {
    console.log("Database connection established...");
    app.listen(4004, () => {
        console.log("Server listening at port 4004...")
    });
}).catch((err) => {
    console.error("Database cannot be connected");
});