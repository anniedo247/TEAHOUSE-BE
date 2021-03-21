const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/authentication")
/**
 * @route POST api/reviews
 * @description Uder can create review
 * @access Login required
 */
router.post("/",authMiddleware.loginRequired,reviewController.createReview )
module.exports = router;