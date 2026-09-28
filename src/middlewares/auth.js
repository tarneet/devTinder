const adminAuth = (req, res, next) => {

    console.log("Authentication check")
    const token = 'xyz';
    const isAuthenticated = token === "xyz";

    if(!isAuthenticated) {
        res.status(401).send("Unauthorized Request");
    }
    else {
        next();
    }
};


const userAuth = (req, res, next) => {

    console.log("User Authentication check")
    const token = 'xyz';
    const isAuthenticated = token === "xyz";

    if(!isAuthenticated) {
        res.status(401).send("Unauthorized Request");
    }
    else {
        next();
    }
};

module.exports = {
    adminAuth,
    userAuth
}