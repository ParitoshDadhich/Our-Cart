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


// router.get("/testroute", isSignedIn, (req, res) =>{
//     res.json(req.auth);
//     // if we run the url without isSigniedIn then it will give us a "a protected route"
//     // but it we use isSignedIn, a middleware, then it will show the correct output i.e. UnauthorizedError: No authorization token was found<br> &nbsp; &nbsp;at middleware 
//     // the correct output or result i.e. UnauthorizedError we get only because of express-jwt milddleware which we used in auth.js file inside the controller folder
//     // the reason behind the UnauthorizedError is we are not using bearer token, if we use bearer toekn then we no longer ger UnauthorizedError.
// });



// throwing all the files which I am creating inside this file to outside the file
module.exports = router;


