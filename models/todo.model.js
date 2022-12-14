const mongoose=require("mongoose");

const todoSchema=new mongoose.Schema({
    user_id:{type:String,required:true},
    title:{type:String,required:true},
    sub:{type:[{subtask:String,id:String}],default:[{subtask:"You dont't have subtask.", id:"xya07xef"}]},
    status:{type:String,default:"pending"},
    category:{type:String,default:"others"},
    description:{type:String,default:"No description is added"},
    date:{type:String,required:true},
    time:{type:String,required:true}
}, { timestamps: true }
)

const Todo=mongoose.model("Todo",todoSchema);

module.exports=Todo