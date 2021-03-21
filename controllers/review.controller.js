const utilsHelper = require("../helpers/utils.helper");
const Review = require("../models/Review");
const Product = require("../models/Product")

const reviewController = {};
reviewController.createReview = async (req, res, next) => {
  try {
    const user= req.userId;
    const {productId, title,body,rating} = req.body;

    let review = await Review.findOne({user, product: productId})
    if(review) {
       return next(new Error("You have already reviewed this product"))
    }
    review = await Review.create({user,product:productId,title,body,rating});
    //const populatedReview = await Review.populate(review,{path:"user"})

    const product = await Product.findByIdAndUpdate(productId,{$push:{reviews:review._id}})

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { review},
      null,
      "Review created"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = reviewController;