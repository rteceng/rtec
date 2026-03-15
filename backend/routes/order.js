const express = require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

const { isAuthendicatedUser, authorizeRoles } = require('../middlewares/authendicate')

router.post('/orders', isAuthendicatedUser,  newOrder);
router.get('/order/:id', isAuthendicatedUser,  getSingleOrder);
router.get('/myorders', isAuthendicatedUser,  myOrders);

//admin route
router.get('/orders', isAuthendicatedUser, authorizeRoles('admin'), orders);
router.put('/order/:id', isAuthendicatedUser, authorizeRoles('admin'), updateOrder);
router.delete('/order/:id', isAuthendicatedUser, authorizeRoles('admin'), deleteOrder);


module.exports = router;