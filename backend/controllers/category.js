//const { update } = require("../models/category");
const Category = require("../models/category");

// middleware, exproting categoryId
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "Category not found"
            });
        }
        req.category = category;     
        next();
    })
};


exports.createCategory = (req, res) => {
      const category = new Category(req.body);  // here we are creating category object from Category model
      category.save((err, category) =>{         // in createCategory function we are using category not Category, In the case of User and some other things we use models like User and all not their objects
          if(err){
              return res.status(400).json({
                error: "Not able to save category in DB"
              });
          }
          res.json({category});
      });
}



// if we want just one category then we can directly populate it from the req.category
// this is possible only because we made a middleware getCategoryById
// get a single category at a time
exports.getCategory = (req, res) => {
    return res.json(req.category);
}


// get all categories at once
exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);
    });
};


// route for updating category
exports.updateCategory = (req, res) => {
    const category = req.category;      // we are able to grab req.category because of getCategoryById middleware
                                         // we are able to grab from the parameters and populating the category because of middleware
    category.name = req.body.name;      // this line is responsible for grabbing the name which is being sent from the frontend or can say postman 

    // since req.category is already a object of database so
    // I can directly fire category.save()

    category.save((err, updateCategory) =>{
        if(err) {
            return res.status(400).json({
                error: "Failed to update category"
            });
        }
        res.json(updateCategory);
    })
 }



// delete route
exports.removeCategory = (req, res) => {
    const category = req.category       // from the middleware because its extracting things from the parameters

    // remove is a function which is given by mongoDB
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete this category"
            });
        }
        res.json({
            messasge: `${category} successfuly deleted`
        });
    });
};



 
