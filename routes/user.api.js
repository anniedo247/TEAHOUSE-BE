var express = require('express');
var router = express.Router();

/**
 * @route POST api/users/
 * @description User can register account
 * @access Public
 */

/**
 * @route GET api/users/me
 * @description Return current user info
 * @access Login required
 */

 /**
 * @route GET api/users/:id/order
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */

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
