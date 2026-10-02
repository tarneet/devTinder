const express = require("express");
const {userAuth} = require("../middlewares/auth");

const router = express.Router();

router.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    res.send("Connection request sent by " + user.firstName);
});


module.exports = router;