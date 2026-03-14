const orderModel = require('../models/orderModels');
const productModel = require('../models/productModels');

exports.createOrder = async (req, res, next) => {

    try {

        const cartItems = req.body;

        const amount = cartItems.reduce(
            (acc, item) => acc + item.product.price * item.qty,
            0
        );

        const order = await orderModel.create({
            cartItems,
            amount,
            status: 'pending'
        });

        for (const item of cartItems) {

            const product = await productModel.findById(item.product._id);

            if(!product){
                return res.status(404).json({
                    success:false,
                    message:"Product not found"
                })
            }

            if(product.stock < item.qty){
                return res.status(400).json({
                    success:false,
                    message:"Not enough stock"
                })
            }

            product.stock -= item.qty;
            await product.save();
        }

        res.json({
            success:true,
            order
        });

    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};