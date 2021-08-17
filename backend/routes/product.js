const express = require("express");
const router = express.Router();


const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");  // we are importing from auth for checking authentication and all other stuff
const {getUserById} = require("../controllers/user");  // we are importing form user because only one user will have as previlidge to make changes in the product
const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product");
const { NotBeforeError } = require("jsonwebtoken");
 


// all of params
router.param("userId", getUserById);
router.param("productId", getProductById);



// all of actual routes
router.post(
    "/product/create/:userId",      // whenever I use /:userId it means I'll be applying or introducing some authentications
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    createProduct
    );

// read route
router.get("/product/:productId", getProduct);  // here we are getting a single product
router.get("/product/photo/:productId", photo);


// delete route
router.delete(
    "/product/:productId/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    deleteProduct
);


// update route
router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
);


// listing route (this route will list all the ts, which we generally notice in any e-commerce website);
router.get("/products", getAllProducts);



router.get("/products/categories", getAllUniqueCategories);     // route for getting all unique categories



module.exports = router;


