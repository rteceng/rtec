const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');


// GET all products http://localhost:8000/api/v1/products
exports.getProducts = catchAsyncError(async (req,res,next)=>{
    const resPerPage = 2;
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success:true,
        count:products.length,
        products
    });

});


// CREATE product http://localhost:8000/api/v1/product/new
exports.newProduct = catchAsyncError( async (req,res,next)=>{

    try{
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(201).json({
            success:true,
            product
        });

    }catch(error){
        next(error);
    }

});


// GET single product http://localhost:8000/api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {

    const product = await Product.findById(req.params.id);
try {
        if(!product){
        return next(new ErrorHandler("product not found",404));
    }
    res.status(200).json({
        success:true,
        product
    });
} catch (error) {
  next(error)
  }
};


// UPDATE product http://localhost:8000/api/v1/product/:id
exports.updateProduct = async (req,res,next)=>{

    try{

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument:'after',
                runValidators:true
            }
        );

        if(!product){
            return next(new ErrorHandler("Product not found",404));
        }

        res.status(200).json({
            success:true,
            product
        });

    }catch(error){
        next(error);
    }

};


// DELETE product http://localhost:8000/api/v1/product/:id
exports.deleteProduct = async (req,res,next)=>{

    try{

        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return next(new ErrorHandler("Product not found",404));
        }

        res.status(200).json({
            success:true,
            message:"Product deleted"
        });

    }catch(error){
        next(error);
    }

};

//create review http://localhost:8000/api/v1/review
exports.createReview = catchAsyncError( async (req, res, next)=>{

    const { productId, rating, comment} = req.body;

    const review = {
        user : req.user.id,
        rating,
        comment
    }

    // finding user whether reviewed or not
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //updating review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })

    }else{
        //creating review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    //average values of product reviews
    product.ratings = product.reviews.reduce((acc, review)=>{
        return review.rating + acc
    }, 0) / product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })

});

//get reviews http://localhost:8000/api/v1/review?id
exports.getReviews = catchAsyncError( async (req, res, next)=>{

        const product = await Product.findById(req.query.id);

        res.status(200).json({
            success : true,
            reviews : product.reviews
        })
})

//delte review
exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    // filter reviews except deleted review
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString();
    });

    // number of reviews
    const numOfReviews = reviews.length;

    // calculate average rating
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;

    ratings = isNaN(ratings) ? 0 : ratings;

    // update product
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    }, { new:true } );

    res.status(200).json({
        success: true
    });

});