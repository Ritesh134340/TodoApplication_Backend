const mongoose=require("mongoose");

const todoSchema=new mongoose.Schema({
    user_id:String,
    title:String,
    status:Boolean,
    discription:String
}, { timestamps: true }
)

const Todo=mongoose.model("Todo",todoSchema);

module.exports=Todo