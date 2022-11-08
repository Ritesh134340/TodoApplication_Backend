const {Router}=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const user=Router();
const User=require("../models/user.model")
user.get("/",(req,res)=>{
    res.send("Welcome to user")
})

user.post("/signup",async(req,res)=>{
    const {first_name,last_name,email,password}=req.body;
    const check=await User.findOne({email:email})
    if(check){
        res.send({"mesg":"User already exist, please login"})
    }
    else{
        bcrypt.hash(password, 4, async function(err, hash) {
          if(err){
            res.send("Something went wrong please try again")
          }
          const new_user=new User({first_name:first_name,last_name:last_name,email:email,password:hash})

          await new_user.save();
         res.send({"mesg":"Signup Successful"})
        });
    }

})

user.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  const user_document=await User.findOne({email:email});

  if(user_document){
    const first_name=user_document.first_name;
    const last_name=user_document.last_name;
    const user_email=user_document.email;
    const hash=user_document.password;
  
    const user_id=user_document._id;

    bcrypt.compare(password,hash,(err,result)=>{
      if(result){
        const token=jwt.sign({user_id:user_id,email:email},process.env.SECRET_KEY)
        res.send({"mesg":"Login Successful","token":token,"name":first_name,"title":last_name,"email":user_email})
      }
      if(!result){
       res.send({"mesg":"Invalid email/password"})
      }
      if(err){
       console.log(err);
       res.send({"mesg":"Login failed"})
      }
     })
  }else{
    res.send({"mesg":"User not found, Please Signup"})
  }
 

 
})

module.exports=user;