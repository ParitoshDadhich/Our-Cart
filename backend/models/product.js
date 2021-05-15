const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; // this is because for linking category with schemas. I can refer to objectId to whatEver schema I have created


// product_schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        requried: true,
        maxlength: 32
    },

    description: {
        type: String,
        trim: true,
        requried: true,
        maxlength: 2000
    },

    price: {
        type: Number,
        requried: true,
        maxlength: 32,
        trim: true
    },

    // I want a category of Tshirt which is linked to the privious which I designed.
    // to do so I need an ObjectId
    category:{
        type: ObjectId, // from where I am pulling up the objectId? It can be come from category.js or user.js. Which can be done using reference parameter
        ref: "Category",    // Based on category model
        requried: true
    },

    stock: {    // it will be giving How many tshirts I am having
        type: Number
    },

    sold: {
        type: Number,
        default: 0
    },    

    photo: {
        data: Buffer,   // photos are stored in a data
        contentType: String
    }

}, {timestamps: true}
);
 
module.exports = mongoose.model("Product", productSchema);      // Question
                                                                // module.eports kar rahe hai, ye export kaha karte hai?