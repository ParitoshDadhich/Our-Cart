const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

// user schema
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // compalsory
        maxlength: 32,
        trim: true  // to trim extra spaces
    },

    lastName: {
        type: String,
       // required: false, // not compalsory
        maxlength: 32,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    userinfo: {
        type: String,
        trim: true
    },
    
    encry_password: {
        type: String,
        required: true
    },
    // we use salt (cryptography) in the generation of password
    salt: String,

    role: {
        type: Number,   // the general rule of number: higher the role more priviledges you will be having
        default: 0      // if the role - 0 that means regular user
    },                  // if the role - 1 or any other number that means Admin

    purchases: {
        type: Array,
        default: []
    }
}, {timestamps: true}
);


// virtual filed creation
userSchema.virtual("password")
    .set(function(password){        // Question
                                    // yaha par password kaha se aaya??
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })



// this method converts the password into secure password using SLAT;
// in the mongoDb we can use .menthods() to implement many such methods
userSchema.methods = {

    // this is used to confirm whether the password which I am entering is correct or not
    autheticate: function(plainPassword){
        return this.securePassword(plainPassword) === this.encry_password;
    },

    securePassword: function(plainPassword){
        if(!plainPassword) return "";   // the reason we are return empty string because it is a required field and if nothing is there then it will show error

        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
        } catch(err){
            return "";
        }
    }
};



// User is like a reference of userSchema which we created. In an analogy we can relate UserSchema is like a class 
// and User is like an object
//To use our schema definition, we need to convert our userSchema into a Model we can work with
module.exports = mongoose.model("User", userSchema);








//  MISTAKES
/*
    1. In the securePassword method, in try, when I was returning the encrypted password I did not use crypto word
    I simply return createHmax..... but not crypto.createHmac......
    The reason was I was learning and simply paste the code from documents and did not use crypto....
    Once the userSchema desing part was done and I was reviewing my code then noticed crypto word was not used(pata aisa laga ki vo chamak nahi raha tha, jo unused variable hota hai na vo chamakte nahi hai)
    then I debug the code and removed the error.
*/