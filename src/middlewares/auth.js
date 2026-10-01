const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {

    try {
        const cookies = req.cookies;
        const { token } = cookies;

        if(!token) {
            throw new Error("Token is not valid");
        }

        const decodedMessage = await jwt.verify(token,"Dev@tinder_secret798");
        const {_id} = decodedMessage;
        const user = await User.findOne({_id: _id});

        if(!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next();

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }
};

module.exports = {
    userAuth
}