const {Router}=require("express");
const authentication=require("../middlewares/authentication.middleware")
const todo=Router();
const Todo=require("../models/todo.model");


todo.get("/",authentication,async(req,res)=>{
  try{ 
       let filter=req.query
       let size=Object.keys(filter).length;
     
       if(size!==0){
        const user_id=req.body.user_id;
        req.query.user_id=user_id

        const document=await Todo.find( req.query)
        res.send({"todos":document})
       }
       else{
        const user_id=req.body.user_id;
        const document=await Todo.find( {user_id:user_id})
        res.send({"todos":document})
       }
        
     todo.get("/:id",authentication,async(req,res)=>{
          try{
              const id=req.params.id
              const document=await Todo.findOne({_id:id})
              res.send({data:document})
          }
          catch(err){
            res.status(404).send({"mesg":"Couldn't fetch data,try again"})
          }
     })
   
  }
  catch(err){
    console.log(err);
    res.send({"mesg":"Failed to get todos"})
  }
 
})

todo.post("/create",authentication,async(req,res)=>{
    const {user_id,title}=req.body
    try{
        const new_todo=new Todo({user_id:user_id,
            title:title,
            status:false,
            })
           await new_todo.save()
           res.send({"mesg":"Todo created successfully"})
    }
    catch(err){
        console.log(err);
        res.send({"mesg":"Couldn't create todo,please try again"})
    }
   
   })

   todo.patch("/update/:id",authentication,async(req,res)=>{
    const id=req.params.id;
     
    try{
        if(Object.keys(req.body).length>0){
            await Todo.findByIdAndUpdate({_id:id},req.body)
            const document=await Todo.findOne({_id:id})
           res.status(200).send({"mesg":"Todo updated successfully",data:document})
        }else{
            res.send({"mesg":"Please give value to update"})
        }
        
    }
    catch(err){
        res.status(404).send({"mesg":"Something went wrong",error:err})
    }
  
   })

   todo.delete("/delete/:id",authentication,async(req,res)=>{
    const id=req.params.id;
   
    try{
        await Todo.findOneAndDelete({ _id: id });
        res.status(200).send({"mesg":"Deleted Successfully"})
    }
    catch(err){
        res.send({"mesg":"Couldn't delete try again"})
    }
  
   })



module.exports=todo;