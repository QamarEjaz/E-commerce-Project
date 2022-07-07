const ErrorHandler = require("../utils/errorHandler");
const AsyncHandler = require("../middleware/catchAysnError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAysnError = require("../middleware/catchAysnError");
const crypto = require("crypto");
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this a sample id",
      url: "profileUrlapi",
    },
  });
  sendToken(user, 201, res);
};
exports.userlogin = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter valid email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email and password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email and password", 401));
  }
  sendToken(user, 200, res);
});

// user loged out
exports.logOut = catchAysnError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "loged out",
  });
});
// forget Password
exports.forgetPassword = catchAysnError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not fond"), 404);
  }
  //  get resetPassword token

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nif have not requested this email then, please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recorvy`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message), 500);
  }
});

// reset password

exports.resetPassword = catchAysnError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("reset password tokenis invalid and expired", 400)
    );
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("password doest not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});
// get user details
exports.getUserDeatails = catchAysnError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
// update password
exports.updatePassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
//  updte user profile
exports.updateUserProfile = AsyncHandler(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
  };
  // we will add cloudary later
  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});
// get all users (admin)
exports.getAllUsers = catchAysnError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// get single user admin
exports.getUserDetails = catchAysnError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User is not exiist with id :${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});
//  updte user role--admin
exports.updateUserRole = AsyncHandler(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user
  });
});

//  delete user role --admin
exports.deleteUser = AsyncHandler(async (req, res, next) => {
 
     const user=await User.findById(req.params.id)


     if(!user){
       return new ErrorHandler(`User does not exist with id :${req.params.id}`)
     }

     await user.remove()
  res.status(200).json({
    success: true,
    message:"User deleted successfully"
  });
});
