const products = require('../data/product.json');
const product = require('../models/productModels');
const dotenv = require('dotenv');
const database = require('../config/database')

dotenv.config({path:'config/config.env'});
database();

const seedProducts = async () => {
    try{
    await product.deleteMany()
    console.log('product deleted');
    
    await product.insertMany(products)
    console.log('product added');
    }
    catch(err){
        console.log(err.message);
    }
    process.exit();   
};

seedProducts();
