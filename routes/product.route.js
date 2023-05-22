const express=require("express")
const {authorization}=require("../middlewares/authorization")
const {product}=require("../models/product.model")

const productRouter=express.Router()

productRouter.get("/products",async(req,res)=>{
    try{
        const products=await product.find()
        res.send({products})
    }catch(err){
        res.send(err.message)
    }
})

productRouter.post("/addproducts",authorization(["seller"]),async(req,res)=>{
    try{
        const p1=new product(req.body)
        await p1.save()
        res.send("Product saved successfully")
    }catch(err){
        res.send(err.message)
    }
})

productRouter.post("/deleteproducts/:productId",authorization(["seller"]),async(req,res)=>{
    try{
        const {productId}=req.params
        const p1=await product.find({productId})
        if(p1.sellerID===req.body.userID){
            await product.deleteOne({productId})
            res.send("Product deleted Successfully")
        }else{
            res.send("Not authorised")
        }
    }catch(err){
        res.send(err.message)
    }
})

module.exports={productRouter}