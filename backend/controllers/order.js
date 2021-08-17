const {Order, ProductCart} = require("../models/order");

exports.getOrderById = (req, res, next, id) =>{
    Order.findById(id)
    .populate("products.product", "name price")     // in the varitey of products we want to grab a single product. we can did by writing products.product || we are grabing name and price respectively
    .exec((err, order) =>{
        if(err) {
            return res.status(400).json({
                error: "No order found in DB"
            });
        }
        req.order = order;
        next();
    })
}   



// creating order
exports.createOrder = (req, res) =>{
    req.body.order.user = req.profile;          // this profile is being populated by param getUserById in the routes folder in order.js file
                                            
    
    const order = new Order(req.body.order);
    order.save((err, order) =>{     // since order is a mongoose object so we can use .save()
        if(err){
            return  res.status(400).json({
                error: "Failed to save you order in DB"
            })
        }
        res.json(order); 
    })
}


exports.getAllOrders = (req, res) => {
    order.find()
    .populate("user", "_id name")
    .exec((err, orders) =>{
        if(err){
            return res.status(400).json({
                error: "No orders found in DB"
            })
        }
        res.json(orders);
    });
};


exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumvalues);
};

exports.updateStatus = (req, res) =>{
    Order.update(
        {_id: req.body.orderId},    // grab it from the front end;
        {$set: {status: req.body.status}},   // updating status based on the req.body.status
        (err, order) =>{
            if(err) {
                return res.status(400).json({
                    err: "Cannot update order status"
                });
            }
            res.json(order);
        }    
    )
}
