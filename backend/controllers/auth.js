// note
// make sure the name of the controler and the route must be same
  

// defining a User model
const User = require("../models/user"); // importing user.js file so that can bring user data from user.js file and store into the database
const {check, validationResult} = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// exproting signup function 
exports.signup = (req, res) => {

    const errors = validationResult(req);

    // validation check with custom message
    if(!errors.isEmpty()){
        return res.status(422).json({
            errors: errors.array()[0].msg

        })
    }

    // HERE I created a user object form the User model
    const user = new User(req.body);        // Question?
                                            // What is req.body? Koi inbuilt property hoti hai ya kuch aur hai?? 

    user.save((err, user) => {  // by writing user.save() we have saved the user in the database
        if(err){                // we want to provide some response back, so that people know the user is successfully saved or not. In order to do the same I am firing a callback function which give the result which we want
            return res.status(400).json({
                err: "Not able to save user in DB"
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};


/*
    Since user variable or object is created from a class User, which further is being created from class of mongoose
    so we can access all the database methods which are provided by mongoose us.
*/

exports.signin = (req, res) => {
    const errors = validationResult(req);
    // extract email and password or can say Destructuring
    const {email, password} = req.body;


    // validation check with custom message
    if(!errors.isEmpty()){
        return res.status(422).json({
            errors: errors.array()[0].msg

        });
    }

    // finds the very first one match from the database
    // here we are searching or finding for email
    // this means we were able to find or not able to find the user in the database
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "USER email does not exists"
            });
        }

        // checking the authetication based on the password
        if(!user.autheticate(password)){
            return res.status(401).json({
                error: "Enter the correct password!"
            })
        }

        // return res.json({
        //     message: "User signin successful"
        // });

        // creting the token with user id and secret
        // that means create a token, put that token into the cookie
        const token = jwt.sign({_id: user._id}, process.env.SECRET);    // QUESTION?
                                                                        // user._id kaha se aayi??
        // put token in cookie
        res.cookie("token", token, {expire: new Date() + "9999"});

        // send response to front end
        const {_id, name, email: _email, role} = user;
        return res.json({token, user : {_id, name, email: _email, role}});
    });
};



// exporting signout function
exports.signout = (req, res)=>{
    // clearing the cokkie which we set in the signin route
    res.clearCookie("token");
    res.json({
        message: "User signout successful"
    });
};



// protected routes
/*
    1. isSignedIn is a middleware
    2. It is to be noted that here we are not using any "next" explictily here but still getting the correct result
       the reason is, It is being possible only because of expressJwt. expressJwt has already covered "next" (expressJwt ki module me already "next" use kiya gaya hai isliye hume next alag se use karne ki need nahi hai)
*/
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"    // this property allows by cookieParser. It works on the req one (between req and res);
    // A question arries what userProperty is doing here and what's present inside "auth"?
    // this middleware i.e. isSignedIn put the "auth" into the request, which can be used further. 
    // auth contains _id, which we got at the time of loggedIn.
})


// custom middleware

// isAuthenticated middleware
exports.isAuthenticated = (req, res, next) => {
    // req.profile - set up from the front-end
    // req.auth - set up by isSignedIn middleware
    // req.profile._id == req.auth._id, if this action comes out to be true that means user can change things into his own account
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;       //  QUESTION?
                                                                                    // What is req.profile? ans what is the difference between req.profile and req.body?
                                                                                    // sari cheeze req.body and req.profile se kase aur kyu access kar late hai??
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
}


// isAdmin middleware
exports.isAdmin = (req, res, next) => {
    if(req.profile.role == 0){
        return res.status(403).json({
            error: "You are not Admin, Access Denied!!"
        });
    }
    next();
};

/*

    FUNCTIONS WHICH WE USED EARLIER FOR TESTING PURPOSE


    // exproting signup function
exports.signup = (req, res) => {
    // in the app.js file we mentioned a middleware bodyParser.json(), so anything that is comming up in the json we can access it
    // eg - can access by using "req.body"
    
        // Note-
        // if in case we want to access the data of urlEncoded type
        // then in the middleware instead of bodyParser.json() use urlEncoded, Must refer documention if in case you find any error
    
        console.log("REQ BODY", req.body);
        res.json({
            message: "Signup route works!"
        });
    };
    
*/