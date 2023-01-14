const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
   first_name:{type:String, required:true},
   last_name:String,
   email:String,
   password:String,
   image:String,
   googleId:{type:String,default:"Google Id"}
})


const User=mongoose.model("User",userSchema);

module.exports=User