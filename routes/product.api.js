const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddlewares = require("../middlewares/authentication");
//
/**
 * @route GET api/products?page=1&limit=10
 * @description User can see list of all products
 * @access Public
 */
//router.get("/", productController.getAllProducts);
/**
 * @route POST api/products/add
 * @description Admin can add product
 * @access Admin Required
 */
// router.post(
//   "/add",
//   authMiddlewares.loginRequired,
//   authMiddlewares.adminRequired,
//   productController.addProduct
// );
/**
 * @route PUT api/products/:id/update
 * @description Admin can update product
 * @access Admin required
 */
// router.put(
//   "/:id/update",
//   authMiddlewares.loginRequired,
//   authMiddlewares.adminRequired,
//   productController.updateProduct
// );
/**
 * @route get api/products/:id
 * @description get single product
 * @access Public
 */
//router.get("/:id", productController.getSingleProduct)
/**
 * @route DELETE api/products/:id
 * @description delete a product
 * @access Admin required
 */
// router.delete("/:id", authMiddlewares.loginRequired,
// authMiddlewares.adminRequired,productController.deleteProduct)

module.exports = router;
