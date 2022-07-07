const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    name:{
            type:String,
            required:[true,"Please enter product Name"],
            trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter product description"]
    },
    price:{
        type:String,
        required:[true,"Please enter product price"],
        maxLength:[8,"Price cannot exceed 8 character"]
    },
    ratings:{
        type:Number,
        required:true
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
         required:[true,"Please enter product stock"],
         maxLength:[5,"stock cannot exeed 4 characers"],
         default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
         {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
             name:{
                 type:String,
                 required:true
             },
             rating:{
                 type:Number,
                 required:true
             },
             comment:{
                 type:String,
                 required:true
             }
         }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Product',productSchema)