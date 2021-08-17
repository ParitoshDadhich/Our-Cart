const express = require("express");
const router = express.Router();

 
const { getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");

// this method will automatically populate a req.profile object with user object which is comming up from the database
router.param("userId", getUserById);    // getUserById is going to populate the req.porfile


// if user wants to get his information like userName, email or in anyway he set his profile
// then he/she needs to loggedIn as well as authenticated
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);  // getting information of the user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);   // here updating the user
router.get("/orders/user/:userId", isAuthenticated, isSignedIn, userPurchaseList);  // listing the user purchase list

 

module.exports = router;
