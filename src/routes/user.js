const express = require("express");
const {userAuth} = require("../middlewares/auth");
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
// router.patch("/user/:userId", async (req, res) => {
//     try {

//         const userId = req.params?.userId;
//         const data = req.body;

//         const ALLOWED_UPDATE = [
//             "firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"
//         ];

//         const isUpdateAllowed = Object.keys(data).every((k) =>
//             ALLOWED_UPDATE.includes(k)
//         );

//         if(!isUpdateAllowed) {
//             throw new Error("Update not allowed");
//         }

//         const user = await User.findByIdAndUpdate(userId, data, {
//             returnDocument: "after",
//             runValidators: true    //   run validations(if any)
//         });
//         res.send(user);
//     } catch (err) {
//         if (err.name === "Error") {
//             return res.status(400).send(err.message);
//         }
//         res.status(500).send("Something went wrong");
//     }

// });


module.exports = router;