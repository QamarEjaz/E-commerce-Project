const express=require('express')
const app=express()
const errorMiddleware=require('./middleware/error')
const cookieParser=require('cookie-parser')
app.use(express.json())
app.use(cookieParser())
const cors =require('cors')
app.use(cors())
//product route import
const product=require('./routes/productRoutes')
app.use('/api/v1',product)

// user routes
const user=require('./routes/userRoutes')
app.use('/api/v1',user)
//order routes
const order=require('./routes/orderRoute')
app.use('/api/v1',order)


app.use(errorMiddleware)
module.exports=app