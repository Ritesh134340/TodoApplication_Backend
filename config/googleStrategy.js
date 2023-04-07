const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require("../models/user.model");
const generator = require('generate-password');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: https://good-puce-top-coat.cyclic.app/auth/google/callback,
  },
  async function(accessToken, refreshToken, profile, done) {
    
    const GoogleUserData=(profile._json)
    const {sub,given_name,family_name,picture,email}=GoogleUserData
    
    try{
        const document=await User.findOne({email:email })
        if(document){
      
        done(null,document)
        }
        else{    
      const password = generator.generate({
      length: 10,
      numbers: true
      });
          const new_user = new User({
            first_name:given_name,
            last_name:family_name,
            email:email,
            password:password,
            image:picture,
            googleId:sub
          });
          await new_user.save();
          const document=await User.findOne({email:email})
          done(null,document)
    
        }
      }
      catch(err){
        console.log(err)
      }
    }
));




module.exports=passport
