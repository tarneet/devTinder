const express = require("express");
const {userAuth} = require("../middlewares/auth");
const {validateUserProfileData} = require("../utils/validation");
const router = express.Router();

router.get("/profile", userAuth, async (req, res) => {

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
// router.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (err) {
//         if (err.name === "Error") {
//             return res.status(400).send(err.message);
//         }
//         res.status(500).send("Something went wrong");
//     }

// });


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