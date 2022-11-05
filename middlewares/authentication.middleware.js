require("dotenv").config()
const jwt=require("jsonwebtoken")
 const authentication=(req,res,next)=>{
 const token=req.headers?.authorization?.split(" ")[1]
 try{
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if(err){
            res.send({"mesg":"Something went wrong please try again later"})
        }
        const {email,user_id}=decoded;
        req.body.email=email;
        req.body.user_id=user_id;
        next()
      });
 }
 catch(error){
     console.log(error);
     res.send({"mesg":"Please login again"})
 }

 
}

module.exports=authentication;