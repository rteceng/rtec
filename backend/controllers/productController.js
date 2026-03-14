const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');


// GET all products http://localhost:8000/api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 2;
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });

});


// CREATE product http://localhost:8000/api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        next(error);
    }

});


// GET single product http://localhost:8000/api/v1/admin/product/:id
exports.getSingleProduct = async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    try {
        if (!product) {
            return next(new ErrorHandler("product not found", 404));
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error)
    }
};


// UPDATE product http://localhost:8000/api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {

    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        next(error);
    }

};


// DELETE product http://localhost:8000/api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {

    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Product deleted"
        });

    } catch (error) {
        next(error);
    }

};