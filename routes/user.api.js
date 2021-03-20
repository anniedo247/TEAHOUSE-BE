var express = require('express');
const authController = require('../controllers/auth.controller');
var router = express.Router();
const userController = require("../controllers/user.controller")
const authMiddlewares = require("../middlewares/authentication")

/**
 * @route POST api/users/
 * @description User can register account
 * @access Public
 */
router.post("/",userController.register)
/**
 * @route GET api/users/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me",authMiddlewares.loginRequired,userController.getCurrentUser)
/**
 * @route PUT api/users/me
 * @description User can update profile
 * @access Login Required
 */
router.put("/me",authMiddlewares.loginRequired,userController.updateProfile)

/**
 * @route GET api/users/:id/order
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */
router.get("/:id/order",authController.loginWithEmail,userController.getCurrentUserOrder)
/**
 * @route Put api/users/:id/payment
 * @description User can make payment
 * @access Login required
 */
/**
 * @route GET api/users
 * @description Admin can get the list of all users
 * @access Admin requied
 */
module.exports = router;
