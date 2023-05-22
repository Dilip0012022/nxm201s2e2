const express=require("express")
const {userModel}=require("../models/user.model")
const fs=require("fs")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userRouter=express.Router()

userRouter.post("/signup",async(req,res)=>{
    try{
        const {name,email,password,role}=req.body
        const isPresent=await userModel.findOne({email})
        if(isPresent){
            return res.send("User already present, Login Please!!")
        }
        const hashed=await bcrypt.hashSync(password,5)
        const user=new userModel({name,email,passwod:hashed,role})
        await user.save()
        res.send("signup successful")
    }catch(err){
        res.send(err.message)
    }
})

userRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        const isPresent=await userModel.findOne({email})
        if(!isPresent){
            return res.send("User not present , Register please!!!")
        }
        const isPass=await bcrypt.compareSync(password,isPresent.password)
        if(!isPass){
            return res.send("Invalid Credentials")
        }
        const token=await jwt.sign({email,userID:isPresent._id,role:isPresent.role},process.env.token,{expiresIn:"1m"})
        const refresh_token=await jwt.sign({email,userID:isPresent._id},process.env.refresh_token,{expiresIn:"5m"})
        res.send({msg:"Login Success",token,refresh_token})
    }catch(err){
        res.send(err.message)
    }
})

userRouter.get("/getnewtoken",(req,res)=>{
    const refresh_token=req.headers.authorization.split(" ")[1]
    if(!refresh_token){
        return res.send("Please login")
    }
    jwt.verify(refresh_token,process.env.refresh_token,(err,decoded)=>{
        if(err){
            return res.send("Please login again")
        }else{
            const token=jwt.sign({userID:decoded.userID,email:decoded.email},process.env.secret,{expiresIn:"1m"})
            res.send("Login Successful",token)
        }
    })
})

userRouter.get("/logout",async(req,res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        const blocked=JSON.parse(fs.readFileSync("./blocked.json","utf-8"))
        blocked.push(token)
        fs.writeFileSync("./blocked.json",JSON.stringify(blocked))
        res.send("Logout Successful")
    }catch(err){
        res.send(err.message)
    }
})

module.exports={userRouter}
