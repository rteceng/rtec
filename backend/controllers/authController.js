const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModels');
const sendToken = require('../utils/jwt');
const ErrorHandler = require('../utils/errorHandler');
const crypto = require("crypto");
const sendEmail = require("../utils/email");

//new register http://localhost:8000/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res);
});

//user login http://localhost:8000/api/v1/login
exports.loginuser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check password
    const isPasswordMatched = await user.isValidPassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

//user logout http://localhost:8000/api/v1/logout
exports.logoutuser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now() - 1000),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: 'Logged Out'
    });
};

//forgot password http://localhost:8000/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next)=>{

    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorHandler('User email not exist',404));
    }

    // generate token
    const resetToken = user.getResetToken();

    await user.save({ validateBeforeSave:false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Reset your password using this link:\n\n${resetUrl}`;

    try{

        await sendEmail({
            email:user.email,
            subject:"Password Recovery",
            message
        });

        res.status(200).json({
            success:true,
            message:"Email sent successfully"
        });

    }catch(error){

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
    }
});

//reset password http://localhost:8000/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // hash token from URL
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // find user with token and valid expiry
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    // if token invalid
    if (!user) {
        return next(new ErrorHandler('Reset Password Token is invalid or expired', 400));
    }

    // check passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    // set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave : false});

    sendToken(user, 201, res)
});

//get User Profile http://localhost:8000/api/v1/myprofile
exports.getUserProfile = catchAsyncError( async (req, res, next)=>{

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success : true,
        user
    })
});

//change password http://localhost:8000/api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {

    const { oldPassword, password } = req.body;

    if(!oldPassword || !password){
        return next(new ErrorHandler("Please enter old and new password",400));
    }

    const user = await User.findById(req.user.id).select('+password');

    // check old password
    const isMatch = await user.isValidPassword(oldPassword);

    if (!isMatch) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    // assign new password
    user.password = password;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });

});

//update profile http://localhost:8000/api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        returnDocument: 'after',
        runValidators:true
    })
    res.status(200).json({
        success : true,
        user
    })
});

//admin: get all users http://localhost:8000/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find()

    res.status(200).json({
        success : true,
        users
    })
});

//admin: get user by id http://localhost:8000/api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`user not found with this id${req.params.id}`, 404))
    }

    res.status(200).json({
        success : true,
        user
    })
});

//admin: update http://localhost:8000/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        returnDocument: 'after',
        runValidators:true
    })
    res.status(200).json({
        success : true,
        user
    })
});

//admin: deleteUser http://localhost:8000/api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.user.id)

    res.status(200).json({
        success : true,
        message : 'user deleted successfully'
    })
});