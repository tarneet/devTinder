const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://aslitaari7_db_user:SpMVMyS9IXkhc5Ww@cluster0.zmrgqwb.mongodb.net/devTinder"
    );
};

module.exports = connectDB;
