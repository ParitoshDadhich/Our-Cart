const express = require("express");

const app = express(); 

 

const port = 8000; // defing ouwn port


app.get("/", (req, res) => {
    return res.send("You are visiting home page!");
});


/*
    NOTE
    we can craft code that if isAdmin is true then only 
    next() will be returned otherwise, we stop the request.
*/

isAdmin = (req, res, next) => {
    console.log("you are the admin");
    next();
}

isLoggedIn = (req, res, next) => {
    console.log("you are logged in");
    next();
}

const admin = (req, res) => {
    return res.send("this is admin dashboard");
}

app.get("/admin", isLoggedIn, isAdmin, admin);





app.get("/paritosh", (req, res) => {
    return res.send("Paritosh uses LinkedIn");
});

app.get("/login", (req, res) => {
    return res.send("You are visiting login route!");
});

app.get("/signup", (req, res) => {
    return res.send("You are visiting signup route!");
})

app.get("/signout", (req, res) => {
    return res.send("You are visiting signout route!");
});

// make sure we are listening on some port
app.listen(port, () => {
    console.log("Server is up and running");
});
