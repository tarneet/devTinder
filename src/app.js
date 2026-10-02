const express = require("express");
const connectDB = require("./config/database");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const requestsRouter = require("./routes/requests");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",userRouter);
app.use("/",requestsRouter);


connectDB()
.then(() => {
    console.log("Database connection established...");
    app.listen(4004, () => {
        console.log("Server listening at port 4004...")
    });
}).catch((err) => {
    console.error("Database cannot be connected");
});