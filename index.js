const connection=require("./config/db");
require("dotenv").config();
const express=require("express");
const app=express();
const cors=require("cors")
app.use(express.json());
const PORT=process.env.PORT || 8080
const userRouter=require("./routes/user.route")
const todoRouter=require("./routes/todo.route");

app.use(cors())
app.use("/user",userRouter)
app.use("/todo",todoRouter)

app.listen(PORT,async()=>{
    try{
      await connection ;
      console.log("Connected to database")
    }
    catch(err){
      console.log(err);
      console.log("Couldn't connect to database")
    }

    console.log(`Server is running in PORT ${PORT}`)
})