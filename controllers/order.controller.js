const utilsHelper = require("../helpers/utils.helper");
const Order = require("../models/Order");
const Product = require("../models/Product");

const orderController = {};
//Create the order
orderController.createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      products,
      paymentMethod,
      shippingAddress,
      total,
      deliveryCharge,
    } = req.body;
    if (products && products.length === 0) {
      return next(new Error("No products added."));
    }
    const productList = [];
    console.log(req.body.products);
    let totalBeforeCharge = 0;
    let totalBe = 0;
    for (let item of products) {
      if (item.quantity < 1) return next(new Error("401 - Invalid quantity."));
      let product = await Product.findById(item.id).lean();

      if (product) {
        product.quantity = item.quantity;
        if (item.size) {
          product.size = item.size;
          if (item.size === "small") {
            totalBeforeCharge += item.quantity * product.price;
          }
          if (item.size === "medium") {
            totalBeforeCharge += item.quantity * (product.price + 5000);
          }
          if (item.size === "large") {
            totalBeforeCharge += item.quantity * (product.price + 10000);
          }
        } else {
          totalBeforeCharge += item.quantity * product.price;
        }

        console.log("kflakfo", totalBeforeCharge);
        productList.push(product);
      }
    }
    totalBe += totalBeforeCharge + deliveryCharge;
    console.log("totalBe", totalBe);
    if (totalBe !== total)
      return next(new Error("401 - Total price is not correct"));
    const order = await Order.create({
      userId: userId,
      total: totalBe,
      deliveryCharge: deliveryCharge,
      products: productList,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
    });
    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
  } catch (error) {
    next(error);
  }
};
//Get detail of an order by its ID
orderController.getDetailOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId });
    if (!order) return next(new Error("401- Order not found"));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "get detail order success"
    );
  } catch (error) {
    next(error);
  }
};
//Update Order to paid
orderController.updateOrderToPaid = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { isPaid: true, paidAt: Date.now() },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order is paid");
  } catch (error) {
    next(error);
  }
};
//Update Order to delivered
orderController.updateOrderToDelivered = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { isDelivered: true, deliveredAt: Date.now() },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order is delivered");
  } catch (error) {
    next(error);
  }
};
//delete order
orderController.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
      },
      { isDeleted: true },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
  } catch (error) {
    next(error);
  }
};

orderController.getAllOrders = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalOrders = await Order.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);

    const orders = await Order.find({})
      .skip(offset)
      .limit(limit)
      .populate("userId");
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { orders, totalPages },
      null,
      `Get all ${orders.length} orders success`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = orderController;
