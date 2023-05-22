const express=require("express")
const bcrypt=require("bcrypt")
const {connection}=require("mongoose")
const {userRouter}=require("./routes/user.route")
const {productRouter}=require("./routes/product.route")
const {hashModel}=require("./models/hashandverify.model")
const {encryptModel}=require("./models/encryptanddecrypt.model")
const {auth}=require("./middlewares/authentication")
const {authorization}=require("./middlewares/authorization")
const jwt=require("jsonwebtoken")
require("dotenv").config()

const crypto=require("crypto")
const algo="aes-256-cbc"
const key=crypto.randomBytes(32)
const iv=crypto.randomBytes(16)

function encrypt(text){
    const cipher=crypto.createCipheriv(algo,Buffer.from(key),iv)
    let encrypted=cipher.update(text,"utf-8","hex")
    encrypted+=cipher.final("hex")
    return encrypted
}
function decrypt(etext){
    const decipher=crypto.createDecipheriv(algo,Buffer.from(key),iv)
    let decrypted=decipher.update(etext,"hex","utf-8")
    decrypted+=decipher.final("utf-8")
    return decrypted
}


const port=process.env.port||8080
const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("working")
})

app.post("/encryptmypwd",async(req,res)=>{
    const {id,password}=req.body
    const encr=encrypt(JSON.stringify(password))
    const data=new encryptModel({id,encr})
    await encr.save()
    res.send("data encrypted",encr)
})

app.get("/getmypwd",async(req,res)=>{
    const {id,password}=req.body
    const data=await encryptModel.findOne({id})
    const decr=decrypt(data.password)
    res.send("decryption done", JSON.parse(decr))
})

app.post("/hashmypwd",async(req,res)=>{
    try{
        const {id,password}=req.body
        const hashed=await bcrypt.hashSync(password,5)
        const h1=new hashModel({id,password:hashed})
        await h1.save()
        res.send("hashed password save")
    }catch(err){
        res.send(err.message)
    }
})
app.post("/verifymypwd",async(req,res)=>{
    try{
        const {id,password}=req.body
        const isPresent=await hashModel.findOne({id})
        if(!isPresent){
            return res.send("password is not present in DB")
        }
        const pass=await bcrypt.compareSync(password,isPresent.password)
        if(!pass){
            return res.send("Wrong password")
        }
        res.send("Found password",pass)
    }catch(err){
        res.send(err.message)
    }
})
app.use("/user",userRouter)
app.use(auth)
app.use("/data",productRouter)

app.listen(port,async()=>{
    try{
        await connection
        console.log("Connected to DB!!!")
    }catch(err){
        console.log(err.message)
    }
    console.log(`listening to port ${port}`)
})