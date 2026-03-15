const Order = require('../models/orderModels');
const Product = require('../models/productModels');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

//create new order http://localhost:8000/api/v1/orders
exports.newOrder = catchAsyncError(async (req, res, next) => {

    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt : Date.now(),
        user : req.user.id
    });

    res.status(201).json({
        success : true,
        order
    });

});

//get single order http://localhost:8000/api/v1/order/:id
exports.getSingleOrder = catchAsyncError( async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate('user', 'name email');

        if(!order){
        return next(new ErrorHandler("order not found with this id", 404));
        }

        res.status(200).json({
            success:true,
            order
        });
});

//get logged user orders http://localhost:8000/api/v1/myorders
exports.myOrders = catchAsyncError( async (req, res, next) => {

    const orders = await Order.find({ user : req.user.id });

           res.status(200).json({
            success:true,
            orders
        });
});

//Admin: get all orders http://localhost:8000/api/v1/orders
exports.orders = catchAsyncError( async (req, res, next) => {

    const orders = await Order.find();

        let totalAmount = 0;

        orders.forEach(order => {
          totalAmount  += order.totalPrice
        })

           res.status(200).json({
            success:true,
            totalAmount,
            orders
        });
});

//admin: update http://localhost:8000/api/v1/order/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order already delivered", 400));
    }

    // update product stock
    for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity);
    }

    order.orderStatus = req.body.orderStatus;

    if (req.body.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true
    });

});

async function updateStock(productId, quantity) {

    const product = await Product.findById(productId);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });

};

//admin: delete order
exports.deleteOrder = catchAsyncError( async (req, res, next) => {

    const order = await Order.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success:true,
            message: 'order deleted'
        });
});