const mongoose=require("mongoose")
const encryptSchema=mongoose.Schema({
    id:{type:String,require:true},
    password:{type:String,require:true},
})
const encryptModel=mongoose.model("encryptedpwds",encryptSchema)
module.exports={encryptModel}