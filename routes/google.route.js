const {Router}=require("express");
const passport=require("../config/googleStrategy");
const jwt = require("jsonwebtoken");
const auth=Router();

auth.get('/google', function(req, res, next) {
  passport.authenticate('google', { scope: ['email','profile'] })(req, res, next);
});

auth.get('/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user) {
    if (err) { return next(err); }
    if (!user) { return res.redirect(`${process.env.REACT_APP_URL}/login`); }
    if(user){
     const {_id,first_name,last_name,email,image}=user;
  
      const token = jwt.sign(
        { user_id:_id, email: email },
        process.env.SECRET_KEY
      );
  
      const newUser={
        mesg:"Authentication Successful",
        token:token,
        name:first_name,
        title:last_name,
        email:email,
        image:image
      }

    const userString = encodeURIComponent(JSON.stringify(newUser));
    res.redirect(`${process.env.REACT_APP_URL}/googleCheck?user=${userString}`);
   }
})(req, res, next);
});


// auth.get('/google/profile',(req,res)=>{
 
//   if(req.user){
//     const {_id,first_name,last_name,email,image}=req.user;

//     const token = jwt.sign(
//       { user_id:_id, email: email },
//       process.env.SECRET_KEY
//     );

//     res.send({
//       mesg:"Authentication Successful",
//       token:token,
//       name:first_name,
//       title:last_name,
//       email:email,
//       image:image
//     })
  
//   }
//   else{
//     res.send({mesg:"Someting went wrong, try again  later"})
//   }
// })

 
  


module.exports=auth
