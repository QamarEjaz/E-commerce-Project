const express=require('express')
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController')
const router=express.Router()
const { isaUthenticatedUser, authorization } = require('../middleware/auth')

router.route('/order/new').post(isaUthenticatedUser,newOrder)
router.route('/order/me').get(isaUthenticatedUser,myOrders)
router.route('/order/:id').get(isaUthenticatedUser,getSingleOrder)
router.route('/admin/orders').get(isaUthenticatedUser,authorization('admin'),getAllOrders)
router.route('/admin/order/:id').put(isaUthenticatedUser,authorization('admin'),updateOrder)
router.route('/admin/order/:id').delete(isaUthenticatedUser,authorization('admin'),deleteOrder)



module.exports=router