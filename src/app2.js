const express = require("express");

const app = express();

/**
 * let say u call route GET /testusers
 * it will go from top to bottom, checking matching route
 * until it reach res(that will be the request handler)
 *  "/" will be called since it handles any route after /
 * becuase i comment res in line 15, and call next() it will move to next and continue to match GET /testusers
 * suppose line 15, if i uncomment res, then it will send response Testing and will not go below that
 */


app.use("/",(req, res, next) => {
    // res.send("Testing");
    console.log("Handler");                     // act as middleware
    next();
});

// a route can have multiple request handlers(see below)

app.get(
    "/testusers",
    (req, res, next) => {
        console.log("Handler 1");                // act as middleware
        next();
    },
    (req, res, next) => {
        console.log("Handler 2");                 // act as middleware
        next();
    },
    (req, res, next) => {
        console.log("Handler 3");                 // act as middleware
        next();
    },
    (req, res) => {
        res.send("Handler 4");               // actual request handler
    },
    (req, res) => {
        res.send("Handler 5");                       // never reach because handler 4 already send response
    },
);


app.get("/test",(req, res) => {
    res.send("hi from test");
});

app.get("/abc",(req, res) => {
    res.send({firstname: "Tarneet"});   // {firstname: "Tarneet"}
});

app.post("/test",(req, res) => {
    res.send("hi from test post");
});

app.get("/users/:userId",(req, res) => {
    console.log(req.params);
    res.send("hi from user params");
});

app.get("/users",(req, res) => {
    console.log(req.query);
    res.send("hi from user");
});


app.get("/",(req, res) => {
    res.send("Testing");
});



// THE ROUTES BELOW WORK ONLY IN EXPRESS JS 4.*.* AND ARE NOT SUPPORTED IN EXPRESS JS 5.*.*


/**
 * {firstname: "Tarneet"}
 * b is optional
 * (ex. http://localhost:4004/ac) or (ex. http://localhost:4004/abc)
 * both will work
 */

// app.get("/ab?c",(req, res) => {
//     res.send({firstname: "Tarneet"});
// });


// /**
//  * {firstname: "Tarneet"}
//  * write as many b as u want to like abbbbbbbc or abc or abbbc
//  * (ex. http://localhost:4004/abbbbbbbc)
//  * must start with a and end with c
//  */

// app.get("/ab+c",(req, res) => {
//     res.send({firstname: "Tarneet"});
// });


// /**
//  * {firstname: "Tarneet"}
//  * write anything beteen ab and cd, it will work
//  * (ex. http://localhost:4004/abTARNEETcd)
//  * must start with ab and ends with cd
//  */

// app.get("/ab*cd",(req, res) => {
//     res.send({firstname: "Tarneet"});
// });


// /**
//  * {firstname: "Tarneet"}
//  * bc is optional
//  * (ex. http://localhost:4004/ad) or (ex. http://localhost:4004/abcd)
//  * but (ex. http://localhost:4004/acd) or (ex. http://localhost:4004/abd) - will not work because it is breaking pattern
//  */

// app.get("/a(bc)?d",(req, res) => {
//     res.send({firstname: "Tarneet"});
// });


// /**
//  * {firstname: "Tarneet"}
//  * write as many bc in between a and d as u want
//  * (ex. http://localhost:4004/ad) or (ex. http://localhost:4004/abcbcbcbcbcd)
//  */

// app.get("/a(bc)+d",(req, res) => {
//     res.send({firstname: "Tarneet"});
// });



app.listen(4004, () => {
    console.log("Server listening at port 4004...")
});