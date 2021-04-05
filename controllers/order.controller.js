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
    } = req.body.order;
    if (products && products.length === 0) {
      return next(new Error("No products added."));
    }
    const productList = [];
    console.log("heheh", products);
    let totalBeforeCharge = 0;
    let totalBe = 0;
    for (let i = 0; i < products.length; i++) {
      // if (products[i].quantity < 1) return next(new Error("401 - Invalid quantity."));
      console.log("iddd", products[i].id);
      let product = await Product.findById(products[i].id).lean();

      console.log("product", product);
      if (product) {
        product.quantity = products[i].quantity;
        if (products[i].size) {
          product.size = products[i].size;
          if (products[i].size === "small") {
            totalBeforeCharge += products[i].quantity * product.price;
          }
          if (products[i].size === "medium") {
            totalBeforeCharge += products[i].quantity * (product.price + 5000);
          }
          if (products[i].size === "large") {
            totalBeforeCharge += products[i].quantity * (product.price + 10000);
          }
        } else {
          totalBeforeCharge += products[i].quantity * product.price;
        }

        console.log("kflakfo", totalBeforeCharge);
        productList.push(product);
      }
    }
    totalBe = totalBeforeCharge + deliveryCharge;
    console.log("before", totalBeforeCharge, deliveryCharge);
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
    const order = await Order.findOne({ _id: orderId }).populate("userId");
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
//Update Order to delivered/paid
orderController.updateOrderToDelivered = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
        isDelivered: true,
        deliveredAt: Date.now(),
        isPaid: true,
        paidAt: Date.now(),
      },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "Order is delivered and paid"
    );
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
orderController.getMyOrders = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalOrders = await Order.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);

    const userId = req.userId;
    console.log("userId", req.userId);
    const orders = await Order.find({ userId: userId })
      .skip(offset)
      .limit(limit)
      .sort({"createdAt":-1})

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
orderController.getAllOrders = async (req, res, next) => {
  try {
    let { page, limit, sortBy,name,...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let totalOrders = await Order.count({ ...filter, isDeleted: false });

    let totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);

    let orders = await Order.find({})
      .skip(offset)
      .limit(limit)
      .populate("userId");
      console.log("name",req.query.name)
      if(req.query.name){
        orders = orders.filter((order)=> order.userId.name === req.query.name)
        totalOrders = orders.length
        totalPages = Math.ceil(totalOrders / limit)

      }
     
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
orderController.getAllOrdersOnline = async (req, res, next) => {
  try {
    let { page, limit, sortBy,name,...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalOrders = await Order.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);

    let orders = await Order.find({})
      .skip(offset)
      .limit(limit)
      .populate("userId");

      orders = orders.filter((order)=> order.userId.role !== "staff")
     
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

orderController.getAllOrdersByDate = async (req, res, next) => {
  try {
    let { page, limit, sortBy,stateDate,endDate,...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalOrders = await Order.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);

    let orders = await Order.find({createdAt:{$gte:stateDate,$lte:endDate}})
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
