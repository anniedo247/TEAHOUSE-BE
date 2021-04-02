const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller");
const authMiddleware = require("../middlewares/authentication")
/**
 * @route POST api/favorite
 * @description Uder can create review
 * @access Login required
 */
// router.post("/",authMiddleware.loginRequired,reviewController.createReview )
module.exports = router;