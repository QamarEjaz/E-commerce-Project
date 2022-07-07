const express =require('express')
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReviews, getProductReviews, deleteReviews } = require('../controllers/productController')

const { isaUthenticatedUser, authorization } = require('../middleware/auth')
const router=express.Router()


router.route('/admin/products/new').post(isaUthenticatedUser, authorization("admin"),createProduct)
router.route('/products').get(getAllProducts)
router.route('/products/:id').get(getProductDetails)
router.route('/admin/products/:id').put(isaUthenticatedUser, authorization("admin"),updateProduct)
router.route('/admin/products/:id').delete(isaUthenticatedUser, authorization("admin"),deleteProduct)
router.route('/review').put(isaUthenticatedUser,createProductReviews)
router.route('/review').get(getProductReviews)
router.route('/review').delete(isaUthenticatedUser,deleteReviews)


module.exports=router