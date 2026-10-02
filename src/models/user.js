const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
        lastName: { type: String, required: true },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if(!validator.isEmail(value)) {
                    throw new Error("Invalid email address");
                }
            }
        },
        password: { type: String, required: true },
        age: { type: Number, min: 18 },
        gender: {
            type: String,
            /**
             *  by default this valdiate fucntion runs only when we create a document
             *  u have to enable it to run  on updates also
             *  to do that, u have to add runValidators in options obj like
             *  const user = await User.findByIdAndUpdate(userId, req.body, {
                    returnDocument: "after",
                    runValidators: true
                });
            *
            */
            validate(value) {
                if(!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if(!validator.isURL(value)) {
                    throw new Error("Invalid photo url");
                }
            }
        },
        about: {
            type: String,
            default: "This is the default description about the user"
        },
        skills: {
            type: [String],
            validate(value) {
                return value.length <= 5
            }
        }

    },
    {
        timestamps: true // added createdAt and updatedAt automatically
    }
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id: user._id}, "Dev@tinder_secret798", {
        expiresIn: "7d"
    });

    return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {

    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;