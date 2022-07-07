const app=require('./app')
const dotenv=require('dotenv')
const connectDB=require('./config/database')

// handle uncatch error
process.on('uncaughtException',(err)=>{
console.log(`Error:${err.message}`)
console.log('shuting down the server due to uncatch error')
process.exit(1)
})
// config
dotenv.config({path:"config/config.env"})
connectDB()

const server= app.listen(process.env.PORT,()=>{
    console.log(`server running on http://localhost ${process.env.PORT}`)
});

process.on('unhandledRejection',(err)=>{
  console.log(`Error:${err.message}`);
  console.log("shuting down the server due to unhandle promise rejection")
  server.close(()=>{
      process.exit(1)
  })
})