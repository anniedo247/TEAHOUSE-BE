const utilsHelper = require("../helpers/utils.helper");
var mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const productController = {};

// create new product
productController.addProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      ingredients,
      instructions,
      weight,
      price,
      images,
    } = req.body;
    let product = await Product.findOne({ name: name });
    if (product) {
      return next(new Error("Product already existed"));
    }
    const { categories } = req.body;
    let categoryIds = [];
    for (let item of categories) {
      let category = await Category.findOne({ name: item });
      if (category) {
        categoryIds.push(category._id);
      } else {
        category = await Category.create({ name: item });
        categoryIds.push(category._id);
      }
    }
    product = await Product.create({ ...req.body, categories: categoryIds });
    product = await Product.populate(product, { path: "categories" });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "product created"
    );
  } catch (error) {
    next(error);
  }
};
//Get all products with filter and query

productController.getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    console.log('filter',filter)
    //const totalProducts = await Product.count({ ...filter, isDeleted: false });
    let totalProducts

    
    const offset = limit * (page - 1);
    
    let categoryArray = [];

    if (req.query.category) {
      const categoryName = req.query.category.split(",");

      for (let i = 0; i < categoryName.length; i++) {
        const category = await Category.findOne({
          name: categoryName[i],
        }).lean();
        console.log("jejej", category._id);
        categoryArray.push(category._id);
      }
    }

    let products;
    if (categoryArray.length === 0) {

      totalProducts = await Product.find().countDocuments()
      products = await Product.aggregate([
        {
          $match: {
            name: new RegExp(req.query.search, "i"),
          },
        },
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviews",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
          },
        },

        { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
      ]);
    } else {
      totalProducts = await Product.find({categories: { $all: categoryArray } }).countDocuments()
      products = await Product.aggregate([
        {
          $match: {
            $and: [
              { name: new RegExp(req.query.search, "i") },
              { categories: { $all: categoryArray } },
            ],
          },
        },
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviews",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
          },
        },

        { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
      ]);
    }
    console.log(totalProducts)
    const totalPages = Math.ceil(totalProducts / limit);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalPages },
      null,
      `Get all ${products.length} product Success`
    );
  } catch (error) {
    next(error);
  }
};
//admin update product
productController.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      ingredients,
      instructions,
      weight,
      price,
      images,
      categories,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }
    if (product) {
      (product.name = name || product.name),
      (product.description = description || product.description);
      product.ingredients = ingredients || product.ingredients;
      product.instructions = instructions || product.instructions;
      product.weight = weight || product.weight;
      product.price = price || product.price;
      product.images = images || product.images;
      product.categories = categories || product.categories;
    }
    const updatedProduct = await product.save();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { updatedProduct },
      null,
      "Product updated"
    );
  } catch (error) {
    next(error);
  }
};
//get single product
productController.getSingleProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    console.log("productId", productId);
    const product = await Product.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(productId) } },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
    ]);
    const productData = await Product.findById(productId).populate("categories").populate({
      path: "reviews",
      populate: { path: "user", select: "name avatarUrl -_id" },
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { avgRating: product[0].avgRating, productData },
      null,
      "Get detail of single product success"
    );
  } catch (error) {
    next(error);
  }
};
//delete product
productController.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete({ _id: productId });
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product deleted success"
    );
  } catch (error) {
    next(error);
  }
};
//add a product to favorite
productController.addFavoriteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isFavorite: true },
      { new: true }
    );
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }
    if (product.isFavorite === true) {
      return next(new Error("Product already added to favorite"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product added to favorite success"
    );
  } catch (error) {
    next(error);
  }
};
//remove a product to favorite
productController.removeFavoriteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isFavorite: false },
      { new: true }
    );
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product removed from favorite success"
    );
  } catch (error) {
    next(error);
  }
};
// get all favorite products
productController.getAllFavoriteProducts = async (req, res, next) => {
  try {
    console.log("test");
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalProducts = await Product.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalProducts / limit);
    const offset = limit * (page - 1);
    //let products = await Product.find({isFavorite: true});

    const products = await Product.aggregate([
      {$match:{isFavorite:true}},
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },

      { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
    ]);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalPages },
      null,
      `Get all ${products.length} product Success`
    );
  } catch (error) {
    next(error);
  }
};
module.exports = productController;
