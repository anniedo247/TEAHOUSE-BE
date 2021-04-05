const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddlewares = require("../middlewares/authentication");

/**
 * @route GET api/orders/myorders
 * @description User can get all their orders
 * @access Login required
 */
router.get(
  "/myorders",
  authMiddlewares.loginRequired,
  orderController.getMyOrders
);
/**
 * @route POST api/orders
 * @description User can create order
 * @access Login require
 */
router.post("/", authMiddlewares.loginRequired, orderController.createOrder);
/**
 * @route GET api/orders/:id
 * @description User can see order detail
 * @access Login required
 */
router.get(
  "/:id",
  authMiddlewares.loginRequired,
  orderController.getDetailOrder
);
/**
 * @route PUT api/orders/:id/paid
 * @description Admin can change order to paid
 * @access Admin require
 */
router.put(
  "/:id/paid",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  orderController.updateOrderToPaid
);

/**
 * @route PUT api/orders/:id/delivery
 * @description Admin can change order to delivered and paid
 * @access Admin require
 */
router.put(
  "/:id/delivery",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  orderController.updateOrderToDelivered
);

/**
 * @route DELETE api/orders/:id
 * @description Admin can delete order
 * @access Admin required
 */
router.delete(
  "/:id",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  orderController.deleteOrder
);

/**
 * @route GET api/orders
 * @description Admin can get all orders
 * @access Admin required
 */
router.get(
  "/",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  orderController.getAllOrders
);
/**
 * @route GET api/orders/online
 * @description Admin can get all orders online
 * @access Admin required
 */
router.get(
  "/online",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  orderController.getAllOrdersOnline
);
/**
 * @route GET api/orders/date
 * @description Admin can get all orders online
 * @access Admin required
 */
router.get(
  "/date",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  orderController.getAllOrdersByDate
);

module.exports = router;
