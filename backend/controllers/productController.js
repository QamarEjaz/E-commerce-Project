const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const AsyncHandler = require("../middleware/catchAysnError");
const ApiFeatures = require("../utils/apiFeatures");

// create products only  admin can add
exports.createProduct = AsyncHandler(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    sucess: true,
    product,
  });
});

// get getAllProducts

exports.getAllProducts = AsyncHandler(async (req, res,next) => {
 
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apifeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apifeature.query;
  res.status(200).json({
    sucess: true,
    products,
    productCount,
    resultPerPage
  });
});

// get single product details
exports.getProductDetails = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  res.status(200).json({
    sucess: true,
    product,
  });
});

// update products admin
exports.updateProduct = AsyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    sucess: true,
    product,
  });
});

// delete product
exports.deleteProduct = AsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await product.remove();
  res.status(201).json({
    sucess: true,
    message: "product successfully deleted",
  });
});

// createing reviews
exports.createProductReviews = AsyncHandler(async (req,res,next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    ratings: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    sucess: true,
  });
});

// get all reviews of single product

exports.getProductReviews = AsyncHandler(async (req, res,next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("product not found"), 404);
  }
  res.status(200).json({
    sucess: true,
    reviews: product.reviews,
  });
});
// deleteReviews
exports.deleteReviews = AsyncHandler(async (req, res,next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("product not found"), 404);
  }
  const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg /reviews.length;
  const numOfReviews=reviews.length;
  await Product.findByIdAndUpdate(req.query.productId,{
      reviews,
      ratings,
      numOfReviews
  },{
      new:true,
      runValidators:true,
      useFindAndModify:false
  })
  res.status(200).json({
    sucess: true,
  });
});
