const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required : [true, 'enter product name'],
        trim : true,
        maxlength : [100, 'product name cannot exeed 100 character' ]
    },
    price:{
        type : Number,
        required : true,
        default : 0.0
    },
    description: {
        type : String,
        required : [true, 'enter product description' ]
    },
    ratings: {
        type : String,
        default : 0
    },
    images : [
        {
            image: {
                type : String,
                required : true
            },
        }
    ],
    category: {
        type : String,
        required : [true, 'enter product category'],
        enum : {
            values : [
                'Electronics',
                'Accessories',
                'Mobile Phones',
                'Laptops',
                'tablet',
                'cloths/shoes',
                'Headphones',
                'books',
                'food',
                'bauty/health',
                'Sports',
                'outdoor',
                'Home/appliances'
            ],
            message : 'please select correct category'
        } 
    },
    seller: {
        type : String,
        required : [true, 'enter seller details']
    },
    stock: {
        type : Number,
        required : [true, 'please enter stock'],
        maxlength : [20, ' product stock cannot exeed 20 ']
    },
    numOfReviews: {
        type : Number,
        default: 0
    },
    reviews :[
        {
            name : {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                default : 0
            },
            comment : {
                type : String,
                required : true
            }
        }
    ],
    user :{
        type : mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type : Date,
        default : Date.now()
    }
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;