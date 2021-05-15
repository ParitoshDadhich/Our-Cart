const User = require("../models/user");
const Order = require("../models/order");

// getUserId middleware (exporting a method so that parameter can be handled)
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            });
        }
        // by doing so I am creating a profile object in the request.
        req.profile = user;
        next();
    })
}


exports.getUser = (req, res) =>{
    // These  four are sensitive infromation should be share becuase it could be use by anyother person for malpractice
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},     // find the user
        {$set: req.body},   // things which we want to update
        {new: true, useFindAndModify: false},   // compulsory parameter
        (err, user) =>{     // here the user which we are getting is the updated user;
            if(err || !user){
                return res.status(400).json({
                    error: "You are not authorized to update the user information"
                });
            }
        // in getUser we had req.profile but in this case we are performing operations on user
        user.salt = undefined;
        user.encry_password = undefined;        // WE ARE APPLYING UNDEFINIG THEM ONLY ON THE USER PROFILE AND NOT IN THE ACUTAL DATABASE
        user.createdAt = undefined;
        user.updatedAt = undefined;
        return res.json(user);
        }
    )
}

// user purchase list and we are pulling the information form the Order model
exports.userPurchaseList = (req, res) =>{
    Order.find({user: req.profile._id}) // we are pulling the infromation from the order model and we are selecting the order which is based on the req.profile._id
    .populate("user", "_id name")   // user - here we are updating user model, by taking _id and name as fields
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No order in this account"
            });
        }
        return res.json(order);
    });
};




// this middleware which is used to push order into the purchase List
// receiving the information from the frontend
exports.pushOrderInPurchaseList = (req, res, next) =>{
    // what we are doing here?
    // we are having an empty array, as of now something is sending information in the form of products
    // and we are just looping through it and extracting all the information and stroing it into the array which is purchases
    let purchases = [];     // this is an local array further we need to push the result into mongoDB
    req.body.order.products.forEach(product => {    // applying loop to pick up individual information from there and will create an object and pushing into the purchases
        purchases.push({            // pushing an object into an array
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.description,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transction_id: req.body.order.transction_id
        });
    });

    // store the result i.e. purchases, into the DB
    // since everything is in the user so we need to use User model    
    // a question arise, why we are using findOneAndUpdate?
    // the reason is if nothing is inside the array then it simply add the elemnts, and if an esisting element is there then instead of overwriting it, it updates its value
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},    // whenever we set the flag, new to true. From the database, send me back the object which is updated one not the old one
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next();
        }
    )
}




// assignment
// exports.getAllUsers = (req, res) =>{
//     User.find().exec((err, users) => {
//         if(err || !users){
//             return res.status(400).json({
//                 error: "No users found"
//             });
//         }
//         res.json(users);
//     });
// };