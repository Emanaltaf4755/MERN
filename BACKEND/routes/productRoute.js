const express = require("express");

const {
    getALLproducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails
} = require("../controllers/productController");

const {
    isAuthenticatedUser,
    authorizeRoles
} = require("../middleware/auth");

const router = express.Router();

// Get all products (Admin only)
router.route("/products")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getALLproducts);

// Create a new product (Logged-in users)
router.route("/product/new")
    .post(isAuthenticatedUser, createProduct);

// Get product details (Public)
router.route("/product/:id")
    .get(getProductDetails)
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, deleteProduct);

module.exports = router;