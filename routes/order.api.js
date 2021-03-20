const express = require("express");
const router = express.Router();
//const orderController = require("../controllers/order.controller")
const authMiddlewares = require("../middlewares/authentication")
/**
 * @route POST api/orders
 * @description User can create order
 * @access Login require
 */
//router.post("/",authMiddlewares.loginRequired,orderController.createOrder)
/**
 * @route POST api/orders/:id/update
 * @description User can update order
 * @access Login require
 */
//router.post("/:id/update",authMiddlewares.loginRequired,orderController.updateOrder)

/**
 * @route GET api/orders/:id
 * @description User can see order detail
 * @access Login required
 */
//router.post("/:id",authMiddlewares.loginRequired,orderController.getDetailOrder)

/**
 * @route DELETE api/orders/:id
 * @description Admin can delete order
 * @access Admin required
 */
//router.delete("/:id",authMiddlewares.loginRequired,authMiddlewares.adminRequired,orderController.deleteOrder)

/**
 * @route GET api/orders
 * @description Admin can get all orders
 * @access Admin required
 */
//router.get("/",authMiddlewares.loginRequired,authMiddlewares.adminRequired,orderController.getAllOrders)
/**
 * @route GET api/orders/me
 * @description Current ser can get all their own orders
 * @access Login Required required
 */
module.exports = router;