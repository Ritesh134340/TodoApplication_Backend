const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport=require("passport");
const User=require("../models/user.model");
const generator = require('generate-password');


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'https://todo-application-z9c7.onrender.com/auth/google/callback',
    scope:['email','profile']
  },
  async function(accessToken, refreshToken, profile, done) {
    try{
      const document=await User.findOne({email: profile.emails[0].value })
      if(document){
        done(null,document)
      }
      else{    
    const password = generator.generate({
    length: 10,
    numbers: true
    });
        const new_user = new User({
          first_name:profile.name.givenName,
          last_name:profile.name.familyName,
          email: profile.emails[0].value,
          password:password,
          image:profile.photos[0].value,
          
        });
        await new_user.save();
        const document=await User.findOne({email:profile.emails[0].value})
  
        done(null,document)
  
      }
    }
    catch(err){
      console.log(err)
    }
  
  }
));

passport.serializeUser((user,done)=>{
  console.log("inside serial")
  done(null,user)
})

passport.deserializeUser(async(user, done) => {
  console.log("inside des")
  const authenticatedUser=await User.findOne({_id:user._id})
  done(null,authenticatedUser)
});




