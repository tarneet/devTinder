const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;

        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({message: "Invalid request"});
        }

        const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status type"});
        }

        const toUser = await User.findOne({_id: toUserId});
        if(!toUser) {
            return res.status(400).json({message: "User does not exists"});
        }

        const connectionExists = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
        });

        if (connectionExists) {
            return res.status(400).json({message: "Connection request already exists"});
        }

        const connReq = new ConnectionRequest({
            toUserId: toUserId,
            fromUserId: fromUserId,
            status: status
        });

        const data = await connReq.save();
        res.json({
            message: (status === "interested") ? "Connection request sent successfully" : "You ignored the Connection request successfully",
            data: data
        });

    } catch(err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }
});


router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status type"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if(!connectionRequest) {
            return res.status(400).json({message: "Connection request does not exists"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        res.json({
            message: (status === "accepted") ? "Connection request accepted successfully" : "You rejected the Connection request successfully",
            data: data
        });

    } catch(err) {
        if (err.name === "Error") {
            return res.status(400).send(err.message);
        }
        res.status(500).send("Something went wrong");
    }
});


module.exports = router;