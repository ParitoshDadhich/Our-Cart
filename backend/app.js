require('dotenv').config()


const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// my routes
const authRoutes = require("./routes/auth.js");     // by doing so we are bringing the code from auth.js file which is present inside routes to this file i.e. app.js file
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoute = require("./routes/paymentBRoutes");

/*
    here localhost - a string which is connecting us
    27017 - port number
    tshirt -database
*/

// database connectivity
mongoose.connect(process.env.DATABASE, {    // process is where all the attach new dependencies || .env is the file name which we created || DATABASE is the string that I saved 
    useNewUrlParser: true,  // compulsory
    useUnifiedTopology: true, // this will help us to keep database connection alive || when I was trying to connect the code without using useUnifiedUrlParser then I was getting error in the console and in the console it was written apply useUnifiedUrlParser
    useCreateIndex: true    // for creating index
}).then(() => {
    console.log("DB CONNECTED");
});

 


// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



// my routes
// I am adding prefix api because I am desing an api
app.use("/api", authRoutes);    //  /api would will be a prefix to all the all the routes that I am mentioning in auth.js
                                // so the route would become eg - /api/nameOfRoute

app.use("/api", userRoutes);  
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBRoute);

// port
const port = process.env.PORT || 8000;


// starting a server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
});
