const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddlewares = require("../middlewares/authentication");

/**
 * @route POST api/products/add
 * @description Admin can add product
 * @access Admin Required
 */
router.post(
  "/add",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  productController.addProduct
);
/**
 * @route GET api/products?page=1&limit=10
 * @description User can see list of all products
 * @access Public
 */
router.get("/", productController.getAllProducts);

/**
 * @route PUT api/products/:id/update
 * @description Admin can update product
 * @access Admin required
 */
router.put(
  "/:id/update",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  productController.updateProduct
);
/**
 * @route get api/products/:id
 * @description get single product
 * @access Public
 */
router.get("/:id", productController.getSingleProduct);
/**
 * @route DELETE api/products/:id
 * @description delete a product
 * @access Admin required
 */
router.delete(
  "/:id",
  authMiddlewares.loginRequired,
  authMiddlewares.adminRequired,
  productController.deleteProduct
);
/**
 * @route Put api/products/:id/favorite
 * @description add a product to favorite
 * @access Login required
 */
router.put("/:id/favorite",authMiddlewares.loginRequired,productController.addFavoriteProduct)
/**
 * @route Put api/products/:id/favorite
 * @description add a product to favorite
 * @access Login required
 */
router.delete("/:id/favorite",authMiddlewares.loginRequired,productController.removeFavoriteProduct)
/**
 * @route GET api/products/favorite
 * @description get all favorite product 
 * @access Login required
 */
router.get("/favorite",authMiddlewares.loginRequired,productController.getAllFavoriteProducts)
module.exports = router;
