const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createReview,
    getReviews,
    deleteReview
} = require('../controllers/productController');

const { isAuthendicatedUser, authorizeRoles } = require('../middlewares/authendicate');

// Get all products
router.get('/products', getProducts);

// Get single product
router.get('/product/:id', getSingleProduct);


// Create new product (Admin only)
router.post('/admin/product/new',
    isAuthendicatedUser,
    authorizeRoles('admin'),
    newProduct
);

// Update product (Admin only)
router.put('/admin/product/:id',
    isAuthendicatedUser,
    authorizeRoles('admin'),
    updateProduct
);

// Delete product (Admin only)
router.delete('/admin/product/:id',
    isAuthendicatedUser,
    authorizeRoles('admin'),
    deleteProduct
);

//review
router.put('/review', isAuthendicatedUser, createReview);
router.get('/review', getReviews);
router.delete('/review', deleteReview);


module.exports = router;