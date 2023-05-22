const jwt=require("jsonwebtoken")
const fs=require("fs")

const auth=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        if(!token){
            return res.send("Please login again!!!")
        }
        const blocked=JSON.parse(fs.readFileSync("./blocked.json","utf-8"))
        const istokenblocked=blocked.find((b_token)=>b_token===token)
        if(istokenblocked){
            return res.send("Please login again")
        }
        const istokenvalid=await jwt.verify(token,process.env.token)
        if(!istokenvalid){
            return res.send("Authentication failed,please login again")
        }
        req.body.userID=istokenvalid.userID
        req.body.email=istokenvalid.email
        req.body.role=istokenvalid.role
        next()
    }catch(err){
        res.send({msg:"login first",error:err.message})
    }
}

module.exports={auth}