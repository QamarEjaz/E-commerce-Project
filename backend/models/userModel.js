const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxlength: [30, "please name cannot exceed 30 character"],
    minlength: [4, "name shuld be greater 4 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minlength: [8, "password shuld be greater 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.getJWTtoken=function(){
    return JWT.sign({id:this._id},process.env.JWT_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    });
}
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.getResetPasswordToken=function(){
  const resetToken=crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex')
  this.resetPasswordExpire=Date.now() + 15 * 60 * 1000;
  return resetToken;
}
module.exports = mongoose.model("User", userSchema);
