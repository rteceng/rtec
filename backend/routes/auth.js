const express = require('express');
const { registerUser, loginuser, logoutuser, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/authController');
const router = express.Router();
const { isAuthendicatedUser, authorizeRoles } = require('../middlewares/authendicate');

router.post('/register', registerUser);
router.post('/login', loginuser);
router.get('/logout', logoutuser);

router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);
router.put('/password/change', isAuthendicatedUser, changePassword);

router.get('/myprofile', isAuthendicatedUser, getUserProfile);
router.put('/update', isAuthendicatedUser, updateProfile);

//admin routs
router.get('/admin/users', isAuthendicatedUser, authorizeRoles('admin'), getAllUsers);
router.get('/admin/user/:id', isAuthendicatedUser, authorizeRoles('admin'), getUser);
router.put('/admin/user/:id', isAuthendicatedUser, authorizeRoles('admin'), updateUser);
router.delete('/admin/user/:id', isAuthendicatedUser, authorizeRoles('admin'), deleteUser);


module.exports = router;