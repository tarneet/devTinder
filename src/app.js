const express = require("express");

const app = express();

app.get("/test",(req, res) => {
    res.send("hi from test");
});

app.get("/",(req, res) => {
    res.send("Testing");
});

app.use((req, res) => {
    res.send("Hello from server");
});

app.listen(4004, () => {
    console.log("Server listening at port 4004...")
});