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
    const user = await User.findById(userId);
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
//Update current user profile
userController.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { name, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const user = await User.findById(userId)
    if (!user) {
      return next(new Error("User not found"))
    }
    if(user){
      user.name = name || user.name;
      if(password){
        user.password = password;
      }
    }
    const updatedUser = await user.save()
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
    const currentUserId = req.params.id;
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

    const users = await User.find()
      .skip(offset)
      .limit(limit)
      
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
module.exports = userController;
