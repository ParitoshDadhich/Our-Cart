const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

const{isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");
const{getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const{updateStock, getAllProducts} = require("../controllers/product");

const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order");


// params (parameter extractor)
router.use("userId", getUserById);
router.use("orderId", getOrderById);

// actual routes
// create
router.post(
    "/order/create/:userId",
    isSignedIn,             // here we are not using isAdmin becuase anybody can place user.
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder
);

// read
router.get(
    "/order/all/:userId",
    isSignedIn,             // here we are not using isAdmin becuase anybody can place user.
    isAuthenticated,
    isAdmin,
    getAllOrders
);


// status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);      // right now only admin can see the status but later we will chnage it to everyone
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);




module.exports = router;