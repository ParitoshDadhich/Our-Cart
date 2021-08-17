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

        let product = new Product(fields);                   


        // handle files here
        if(file.photo){
            if(file.photo.size > 3000000) {         // = 1024*1024*3
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
 


        // updation code
        let product = req.product;   

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
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";       // Here I am giving a previledge of sorting to user, on which bases he or she wants to sort the products
 


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


 
