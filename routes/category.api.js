const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/authentication")
/**
 * @route POST api/categories
 * @description Admin can create category
 * @access Admin required
 */
router.post("/",authMiddleware.loginRequired,authMiddleware.adminRequired,categoryController.create )
module.exports = router;