const mongoose=require("mongoose")
const productSchema=mongoose.Schema({
    title:{type:String,require:true},
    productID:{type:String,require:true},
    sellerID:{type:String,require:true},
    price:{type:String,require:true},
    createdAt:{type:String,require:true}
})
const product=mongoose.model("products",productSchema)
module.exports={product}