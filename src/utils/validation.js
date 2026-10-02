const validator = require("validator");
const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}


const validateUserProfileData = (req) => {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATE = [
        "firstName", "lastName", "age", "gender", "skills", "photoUrl", "about", "skills"
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATE.includes(k)
    );

    return isUpdateAllowed;
}

module.exports = {
    validateSignUpData,
    validateUserProfileData
}