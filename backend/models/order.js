const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// these products are not something which are being created on the go
// these perticular product is based on the product that we have created in the past.
// i.e. this product is based on the productSchema which we created in product.js file in models folder

// product_cart_schema
const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,         // Based on product model
        ref: "Product"          // Question
                                // agar ye Product ko refer kar raha hai to jitni bhi properties hai product.js file me sabko access kar sakta hai kya??
    },

    name: String,
    count: Number,   // gives you the count of how many products you are ordering
    price: Number
})

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);   // Question 
                                                                        //    what if ProductCart differnt liya ho declaration and mongoose.moldel()??


// order_schema
const OrderSchema = new mongoose.Schema(
{
    products: [ProductCartSchema],
    transction_id: {},
    amount: {type: Number},
    address: String,
    status:{
        type: String,
        default: "Recieved",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
    },
    updated: Date,  // when I  product was ordered
    user:{
        type: ObjectId, // whenever I use type then I must have to use reference
        ref: "User"     // Based on user Model
    }

}, {timestamps: true}
);

const Order = mongoose.model("Order", OrderSchema);

// throwing Order and ProductCart
module.exports = {Order, ProductCart};

 