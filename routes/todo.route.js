const {Router}=require("express");
const authentication=require("../middlewares/authentication.middleware")
const todo=Router();
const Todo=require("../models/todo.model");

todo.get("/",authentication,async(req,res)=>{
    const user_id=req.body.user_id;
    let {order, category ,status,page,limit} = req.query; 
    let queryObj={}

    queryObj.user_id=user_id

    if(category){
        queryObj.category=category
    }
    if(status){
        queryObj.status=status
    }

    let newData=Todo.find(queryObj)

    if(order){
        let Order=-1;
        if(order[0]==="asc"){
           Order=-1
        }
        if(order[0]==="desc"){
          Order=1
        }

       newData.sort({date:Order,createdAt:Order})
       
    }
    
    let currentPage=Number(page) || 1;
    let perPage=+limit || 10;
    let skip=(currentPage-1)*perPage;

    newData= newData.skip(skip).limit(perPage)

    let lengthData=await Todo.find(queryObj)

    let totalPages=Math.ceil(lengthData.length/perPage)

    let data=await newData

     res.send({"todos":data,"totalPages":totalPages})



    // if(page && limit){
    //     let total=data.length;
    //     let lastIndex=limit*page;
    //     let firstIndex=lastIndex-limit;
    //     let totalPages=Math.ceil(total/limit)
    //     let newData= data.slice(firstIndex,lastIndex)
    //     res.send({"todos":newData,"totalPages":totalPages})
    // }
   
  
    


})


todo.get("/chartdata",authentication,async(req,res)=>{
    const user_id=req.body.user_id;
   
    try{
        let queryObj1={}
        queryObj1.user_id=user_id
        queryObj1.status="pending"

        let queryObj2={}
        queryObj2.user_id=user_id
        queryObj2.status="completed"

        let queryObj3={}
        queryObj3.user_id=user_id
        queryObj3.status="progress"


        const completed=await Todo.find(queryObj2)
        const pending=await Todo.find(queryObj1)
        const progress=await Todo.find(queryObj3)


        res.status(200).send({"completed":completed,"pending":pending,"progress":progress})
    }
    catch(err){
        res.status(404).send({"mesg":"Couldn't fetch data,try again"})  
    }
})


      
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

todo.post("/create",authentication,async(req,res)=>{
   

    const {user_id,title,subtask,status,category,description}=req.body
       
    try{
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        let nd = new Date(utc + (3600000*+5.5));
        let  ist =  nd.toLocaleString();
        let date=ist.split(", ")[0];
        let time=ist.split(", ")[1];
       
      
        const new_todo=new Todo({user_id:user_id,
            title:title,
            sub:subtask,
            status:status,
            category:category,
            description:description,
            date:date,
            time:time
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