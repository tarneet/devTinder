const express = require("express");

const router = express.Router();

const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");


router.post("/signup", async (req, res) => {

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


router.post("/login", async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({emailId: email});

        if(!user) {
            return res.status(400).send("Incorrect email/password");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(400).send("Incorrect email/password");
        }

        const token = await user.getJWT();
        res.cookie("token", token);
        res.send("Login Successful!!!");

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }


});



module.exports = router;