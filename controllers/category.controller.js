const utilsHelper = require("../helpers/utils.helper");
const Category = require("../models/Category");

const categoryController = {};
categoryController.create = async (req, res, next) => {
  try {
    let category = await Category.findOne({name: req.body.name});
    if(category) {
       return next(new Error("category already existed"))
    }
    category = await Category.create(req.body);
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { category},
      null,
      "category created"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = categoryController;