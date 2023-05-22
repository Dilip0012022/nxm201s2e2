const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    role:{type:String,enum:["customer","seller"],default:"customer"}
})
const userModel=mongoose.model("user",userSchema)
module.exports={userModel}