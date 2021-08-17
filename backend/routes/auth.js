var express = require("express");
var router = express.Router();
const { check } = require('express-validator');

// there could be many functons in auth.js file 
// but I am explicitly importing "signout and signup, signin, and isSigedIn" function
// THIS IS AN EXAMPLE OF USING CONTROLLERS
const {signout, signup, signin, isSignedIn} = require("../controllers/auth");


// signup route with validation
router.post("/signup", [
    check("name", "name should have atleast 3 characters").isLength({min: 3}),
    check("email", "email should be in correct format").isEmail(),
    check('password', 'The password must be 5+ chars long and contain a number')
    .not()
    .isIn(['123', 'password', 'god', '12345'])
    .withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/)
], signup);


router.post("/signin", [

    check("email", "email should be in correct format").isEmail(),
    check("password", "incorrect password").isLength({min: 1})
    
], signin);


router.get("/signout", signout);


// throwing all the files which I am creating inside this file to outside the file
module.exports = router;


