const express = require("express");
const {userAuth} = require("../middlewares/auth");
const {validateUserProfileData} = require("../utils/validation");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const router = express.Router();

const USER_DATA = ["firstName", "lastName", "skills", "age", "photoUrl"];

router.get("/user/profile", userAuth, async (req, res) => {

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

router.get("/user/connections", userAuth, async (req, res) => {

    try {
        const user = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: user._id},
                {toUserId: user._id}
            ],
            status: "accepted"
        }).populate("fromUserId", USER_DATA).populate("toUserId", USER_DATA);

        const data = connections.map((row) => {
            if(row.fromUserId._id.equals(user._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }

});

router.get("/user/requests/recieved", userAuth, async (req, res) => {

    try {
        const user = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: user._id,
            status: "interested"
        }).select(["status"]).populate("fromUserId", USER_DATA);

        const data = requests.map((row) => row.fromUserId);

        res.json({data});

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }

});

router.get("/feed", userAuth, async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 1;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ]
        }).select(["fromUserId", "toUserId"]);


        const excludedUserIds = new Set();

        connections.forEach(connection => {
            excludedUserIds.add(connection.fromUserId.toString());
            excludedUserIds.add(connection.toUserId.toString());
        });

        const users = await User.find({
            _id: { $nin: Array.from(excludedUserIds) }
        }).select(USER_DATA).skip(skip).limit(limit);

        res.json({users});

    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }

});


// // delete user
// router.delete("/user", async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully");
//     } catch (err) {
//         if (err.name === "Error") {
//             return res.status(400).send(err.message);
//         }
//         res.status(500).send("Something went wrong");
//     }

// });

// // update user
router.patch("/user/:userId", userAuth, async (req, res) => {
    try {

        if(!validateUserProfileData(req)) {
            throw new Error("Invalid Edit request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({message: "Profile updated successfully", data: loggedInUser});
    } catch (err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }

});


module.exports = router;