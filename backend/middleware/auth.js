const ErrorHandler = require("../utils/errorHandler");
const catchAysnError = require("./catchAysnError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
exports.isaUthenticatedUser = catchAysnError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_KEY);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorization = (...roles) => {
  console.log(roles)
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next( new ErrorHandler(
        `Role:${req.user.role} is not allowed to access these resoures`,
        403
      ))
    }
    next();
  };
};
