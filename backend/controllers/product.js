const Product = require("../models/product");
const formidable = require("formidable");   // for creating product
const _ = require("lodash");
const fs = require("fs"); // fs - file system which comes default in the node.js
const { selectFields } = require("express-validator/src/select-fields");




// middleware to find product id
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")   // here I am populating the product based on the category only
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product not found!"
            })
        }
        req.product = product;
        next();
    })
}




exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();   // 
    // form object accepts three parameters 1. error 2. field (name, discription, price, etc.) 3. files

    form.keepExtensions = true; // form saving files into png or jpeg format

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with the image!"
            });
        }

        // destructure the fields
        const {name, description, price, category, stock} = fields;
        
        // adding some restrictions
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please include all fields!"
            });
        }

        let product = new Product(fields);                  // QUESTION?
                                                            // What's the significance of this line


        // handle files here
        if(file.photo){
            if(file.photo.size > 3000000) {         // = 1024*1024*3
                return res.status(400).json({
                    error: "File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);  // assignig the path of the photo

            //  QUESTION?
            //  What's the significance of Content type?
            product.photo.contentType = file.photo.type;    // assigning the content type of the photo
        }
        //console.log(product);

        // save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })
    })
}


exports.getProduct = (req, res) => {
    req.product.photo = undefined;  // we are undefining the photo part because files of photos are bulky and tricky to grab from the database. So we are simply undefining it so that it can retrun get request rapidly
    return res.json(req.product);
}

// middleware
// when we fire a request form the frontend getProduct will prase the rest of the thing
// this middleware form the backend will load the photo on the background

exports.photo = (req, res, next) => {       // as soon as front end fires the request then backend will load the photo in the background using this middleware.
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);     // content-Type is the key here jisme value set kar raha hu
        return res.send(req.product.photo.data);
    }
    next();
}


// delete controllers
exports.deleteProduct = (req, res) =>{
    let product = req.product;      // since product is an object and we are interacting with the database so I can use .remove() 
                                    // .remove() gives two things because it is interactin with the database : 1. error 2. deletedProduct;
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to delete the product"
            });
        }
        res.json({
            message: "Deletion was successful: ", deletedProduct
        });
    });                          
};


// update controllers

/*
    PLAN
    Just like we have all the fields in the UI to save a product, 
    similarly we are going to have a similar UI for updation of the product.

    What we will do?
    As soon as the updation page will load, we are going to pull up the information from the database, fill up all the fields with that information
    and as soon as user hits to save, we are going to perform a save operation on top of that.
    So the same product is getting from the database and same product is getting saved there
*/


exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();   // 
    // form object accepts three parameters 1. error 2. field (name, discription, price, etc.) 3. files
    form.keepExtensions = true; // form saving files into png or jpeg format

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with the image!"
            });
        }

        //  HERE I AM NOT DESTRUCTRUING THE FIELDS OR ADDING SOME RESTRICTIONS
        // THE REASON IS DURING THE UPDATING PROCESS, TO INCLUDE THE ALL THE FIELDS IS NOT MANDATORY
        // ITS USER CHOICE, HE IS WILLING TO UPDATE WHICH FIELD 
/*        
        // destructure the fields
        const {name, description, price, category, stock} = fields;
        
        // adding some restrictions
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please include all fields!"
            });
        }
*/



        // updation code
        let product = req.product;  // how we are able to grab req.product?
                                    /*
                                      In the put route, we are getting the productId, as soon as it sees the productId the params will fire up and we hold this up here  
                                      */

        // we are using loadash here    // these fields are going to update in the product
        product = _.extend(product, fields)    // it updates the value 

        // handle files here
        if(file.photo){
            if(file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);  // assignig the path of the photo
            product.photo.contentType = file.photo.type;    // assigning the content type of the photo
        }
        //console.log(product);

        // save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Updation of product failed"
                })
            }
            res.json(product);
        })
    });
}


// product listing
exports.getAllProducts = (req, res) => {
    /*
        req.query.limit
        If there is a query from the frontend and it has a property of .limit then we can use a ternary operator
        why we are using parseInt?
        Whenever we are taking any parameter from users, javaScript handles that parameter as a string value. So convering it into integer.
    */
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";       // Here I am giving a previledge of sorting to user, on which bases he or she wants to sort the products

/*
        what are the things which you want to select like name, email, description, price and all
        NOTE
        Either we can mention all the fieds separately which we want to select
        or we can use "-", here minus shows I dont't want to select this item.
*/


    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])         // by using .sort(), we can sort the result based on our requirements like sort on the bases of creation date, sort on the bases of how many products we have sold or in any other popular way
    .limit(limit)   // here limit shows we will be listing these number of items only
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "NO Product Found!"
            })
        }
        res.json(products);
    })
};

 

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) =>{    //1. from which you want to get it
        if(err){
            return res.status(400).json({
                error: "No error found"
            })
        }
        res.json(category);
    })         
}


/*
    PLAN
    Now our aim is to focus on to updating the inventory
    so whenever a user purchases a product then stock number will get decreased and then sold number will get increased


*/
// middleware for updating stock as well as sold
exports.updateStock = (req, res, next) => {
                            // we are having an order which is having many products and we are looping or mapping through it and grabbing every single element form the kart. prod is every single object of that loop
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {    // for every single prod I am firing up this updateOne method
                filter: {_id: prod._id},    // finding the product based on the prod._id
                
                // applying update operation. stock is going down and sold is going to increment
                update: {$inc: {stock: -prod.count, sold: +prod.count}}  // this prod.count opertion will be thrown form the front end
            }
        }
    })


    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed!"
            })
        }
        next();
    })
}


 