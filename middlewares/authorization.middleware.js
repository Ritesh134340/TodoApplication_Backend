
const User=require("../models/user.model")

const authorization=(permittedrole)=>{
  return async(req,res,next)=>{
     const {email}=req.body;
     const user=await User.findOne({email:email})
     const role=user.role
  
     if(permittedrole.includes(role)){
        next()
     }
     else{
        res.send("Not authorized")
     }
  }
}

module.exports=authorization;