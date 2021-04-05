const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const userController = {};

/* Register*/
userController.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) return next(new Error("401 - Email already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password });

    const accessToken = await user.generateToken();

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Created account"
    );
  } catch (error) {
    next(error);
  }
};

/* Get current user info */
userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("favorite");
    if (!user) return next(new Error("401 - User not found"));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get current user success"
    );
  } catch (error) {
    next(error);
  }
};
/* Admin can get all users info */
userController.getAllUsersInfo = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return next(new Error("401 - User not found"));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get user success"
    );
  } catch (error) {
    next(error);
  }
};
//Update current user profile
userController.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { name, avatarUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new Error("User not found"));
    }
    if (user) {
      user.name = name || user.name;
      user.avatarUrl = avatarUrl || user.avatarUrl;
    }
    const updatedUser = await user.save();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { updatedUser },
      null,
      "Update current user's profile success"
    );
  } catch (error) {
    next(error);
  }
};

//Get order of current user
userController.getCurrentUserOrder = async (req, res, next) => {
  try {
    //pagination
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalOrders = await Order.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);
    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    //target user
    const userId = req.params.id;

    // current user request other Order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error("401- only admin able to check other user Order detail")
      );
    }
    // current user request its Order or Admin request user's order
    const order = await Order.find({ userId })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);
    // in case no order
    if (!order) return next(new Error(`401- ${user} has no order`));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, totalPages },
      null,
      "get order from userId success"
    );
  } catch (error) {
    next(error);
  }
};

//Admin can get all user info
userController.getAllUsers = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalUsers = await User.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalUsers / limit);
    const offset = limit * (page - 1);

    const users = await User.find().skip(offset).limit(limit);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { users, totalPages },
      null,
      `Get all ${users.length} users success`
    );
  } catch (error) {
    next(error);
  }
};
userController.updateFavorite = async (req, res, next) => {
  try {
    const userId = req.userId;
    const productId = req.body.productId;
    console.log("idd",productId)
    let user = await User.findById(userId).lean();
    console.log("user",user)
    console.log("fafa",user.favorite)

    if (!user) return next(new Error("401 - User not found"));
    let newFavorite=[];

    if (user) {
      let existProductId = false;
      for (let i = 0; i < user.favorite.length; i++) {
        console.log("runnig",productId)
        console.log("ra",user.favorite[i])

        if (user.favorite[i] == productId) {
          console.log("run")

          existProductId= true
          console.log("exist",existProductId)
          newFavorite = user.favorite.filter((item) => item != productId);
          console.log("new",newFavorite)
         
        }
      }
      if(!existProductId) {
        newFavorite = [...user.favorite, productId];
      }
    }
    console.log("ffff",newFavorite)
    user = await User.findByIdAndUpdate(
      userId,
      { favorite: newFavorite },
      { new: true }
    );
   console.log("usss",user)
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get user success"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = userController;
