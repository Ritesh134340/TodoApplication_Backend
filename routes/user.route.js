const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = Router();
const User = require("../models/user.model");
const upload=require("../middlewares/upload.middleware")
const authentication=require("../middlewares/authentication.middleware")

user.post("/signup",upload.single("image"), async (req, res) => {
  const path = `/images/${req.file.filename}`;

  const { first_name, last_name, email, password } = req.body;
  const check = await User.findOne({ email: email });

  if (check) {
    res.send({ mesg: "User already exist, please login" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send("Something went wrong please try again");
      }
      const new_user = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hash,
        image:path
      });

      await new_user.save();

      res.send({ mesg: "Signup Successful" });
    });
  }
});

user.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user_document = await User.findOne({ email: email });


  if (user_document) {
    const first_name = user_document.first_name;
    const last_name = user_document.last_name;
    const user_email = user_document.email;
   
    
    const hash = user_document.password;
    const image=user_document.image;
    const user_id = user_document._id;

    bcrypt.compare(password, hash, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { user_id: user_id, email: email },
          process.env.SECRET_KEY
        );
        res.send({
          mesg: "Login Successful",
          token: token,
          name: first_name,
          title: last_name,
          email: user_email,
          image:image
        });
      }
      if (!result) {
        res.send({ mesg: "Invalid email/password" });
      }
      if (err) {
        console.log(err);
        res.send({ mesg: "Login failed" });
      }
    });
  } else {
    res.send({ mesg: "User not found, Please Signup" });
  }
});


user.patch("/update",upload.single("image"),authentication,async(req,res)=>{
   let filename=req.file?.filename
   if(typeof filename!=="undefined"){
   const  path = `/images/${filename}`;
     req.body.image=path;
   }
 
  const user_id=req.body.user_id;
   
  try{
       await User.findByIdAndUpdate(user_id,req.body)  
       let user=await User.findOne({_id:user_id})
      
       const email=user.email
       const token = jwt.sign(
        { user_id: user_id, email: email },
        process.env.SECRET_KEY
      );

      const document={
        name:user.first_name,
        title:user.last_name,
        email:user.email,
        token:token,
        image:user.image
      }
        
       res.status(200).send({"mesg":"User updated Successfully",document:document}) 
      }
    
  catch(err){
      res.status(404).send({"mesg":"Something went wrong",error:err})
  }
 
})

module.exports = user;
