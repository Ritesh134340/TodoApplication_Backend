require("dotenv").config();
require("./config/googleStrategy")


const connection=require("./config/db");
const express=require("express");
const cookieSession = require("cookie-session");
const cors=require("cors");
const passport=require("passport")
const app=express();




app.use(cors({
  origin:`${process.env.REACT_APP_URL}`,
  methods:"GET,PUT,POST,DELETE,PATCH",
  credentials:true
}))


app.use(
  cookieSession({
    secret:process.env.SECRET_KEY,
    resave:true,
    saveUninitialized:true,
    cookie:{
      maxAge:1000*60*60*24*7
    }
     
  })
);

app.use(passport.initialize())
app.use(passport.session());
app.use("/images",express.static("images"))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT=process.env.PORT || 8080
const userRouter=require("./routes/user.route")
const todoRouter=require("./routes/todo.route");
const googleRouter=require("./routes/google.route")


app.use("/user",userRouter)
app.use("/todo",todoRouter)
app.use("/auth",googleRouter)

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