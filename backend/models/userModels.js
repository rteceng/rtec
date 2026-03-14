const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'please enter name']
    },

    email:{
        type:String,
        required:[true,'please enter email'],
        unique:true,
        validate:[validator.isEmail,'please enter valid email']
    },

    password:{
        type:String,
        required:[true,'please enter password'],
        minlength:[6,'password must be at least 6 characters'],
        select : false
    },

    avatar:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

userSchema.pre('save', async function(){

    if(!this.isModified('password')){
        return 
    }

    this.password = await bcrypt.hash(this.password, 10);
    
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.getJwtToken = function(){
    return jwt.sign(
        {id:this.id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_TIME}
    )
};

userSchema.methods.isValidPassword = async function (enteredPasswordred){
   return await bcrypt.compare(enteredPasswordred, this.password)    
};


userSchema.methods.getResetToken = function(){

//generate Token
const token = crypto.randomBytes(20).toString('hex');

//genrate hash and set to resetPasswordToken
this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

//set resetToken expire time
this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

return token;
};

module.exports = mongoose.model('User',userSchema);