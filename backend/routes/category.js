const express = require("express");
const router = express.Router();


const {getCategoryById, createCategory, getAllCategory, getCategory, updateCategory, removeCategory} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");
// const { get } = require("mongoose");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


// create route
router.post(    // we make post request when we want to put something into the database
    "/category/create/:userId",     // in this case we are creating category.
    isSignedIn,
    isAuthenticated,
    isAdmin,        // here isAdmin shows that only admin can make changes in the category
    createCategory
);

// read route
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

// update route
router.put(
    "/category/:categoryId/:userId",        // in this case first I want to grab a categoryId, which is being updated by userId.
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);


// delete route
router.delete(
    "/category/:categoryId/:userId",        // in this case first I want to grab a categoryId, which is being updated by userId.
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
);



module.exports = router;