const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

    try {

        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // creating a new instance of user model

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });

        await user.save();
        res.send("User added successfully!");
    } catch (err) {

        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }


});


app.post("/login", async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({emailId: email});

        if(!user) {
            return res.status(400).send("Incorrect email/password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send("Incorrect email/password");
        }

        const token = await jwt.sign({_id: user._id}, "Dev@tinder_secret798");
        res.cookie("token", token);
        res.send("Login Successful!!!");

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }


});


app.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }

});

// get all users from db
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }

});


// delete user
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
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
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
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