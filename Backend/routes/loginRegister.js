const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const {registerSchema,loginSchema} = require("../validation/Register");
const passport = require('passport');
const multer = require('multer');
const s3bucket = require('../config/s3');
// const path = require('path');
// const upload = multer({dest : path.join(__dirname,"..","uploads")});
const storage = multer.memoryStorage();
const upload = multer({storage});
// const loginSchema = require("../validation/Login");

async function addUser(req,res){
   const errors = {};
   const {username,userId,email,password,tagline} = req.body;
   const file = req.file;
   // console.log(req.body,req.file);
   let user = {username,userId,email,password,tagline};
   try{
      user = await registerSchema.validateAsync(user);
      const userExists = await User.findOne({userId : req.body.userId});
      if(userExists) throw new Error("User Id already in use!!");
      const passwordSalt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password,passwordSalt);
      if(!user.tagline){
         user.tagline = "Hello There";
      }





        const params = {
           Bucket: 'shopin1',
           region:'us-east-1',
           Key: file.originalname,
           Body: file.buffer,
           ContentType: file.mimetype,
        };

        const uploadPromise = new Promise(function(resolve,reject){
           s3bucket.upload(params,function(err,data){
              if(err){
                 reject(err);
              }else{
                 resolve({status : "success"});
              }
           });
        });

        await uploadPromise;
        user.filename = "https://shopin1.s3.amazonaws.com/" + params.Key;
        const newUser = new User(user);

      await newUser.save();
      res.json({err : ""});
   }
   catch(e){
      if (e.details){
         for (let detail of e.details){
            errors[detail.context.label + "Err"] = detail.message
         }
      }
      else if (e.message){
         errors.generalErr = e.message;
      }
      else{
         errors.generalErr = e;
      }
      res.json({err : errors});
   }
}

async function validateUser(req,res,next){
   const errors = {};
   try {
      await loginSchema.validateAsync(req.body);
      next();
   }
   catch(e){
      if (e.details){
         for (let detail of e.details){
            errors[detail.context.label + "Err"] = detail.message
         }
      }
      res.json({err : errors});
   }
}

router.post("/api/register",upload.single('filename'),addUser);
router.post("/api/login",validateUser,function(req,res,next){
   passport.authenticate('local',function(err,user,errors){
      if(user){
         req.logIn(user,function(err){
            if(err){
               next(err);
            }else{
               // console.log(req.user);
               req.session.save(function(){
                  res.json({err : ""});
               });
            }
         });
      }else{
         res.json({err : errors});
      }
   })(req,res,next);
   // res.send("loggedin");
});

router.get("/api/logout",function(req,res){
   console.log(req.isAuthenticated());
   if(req.isAuthenticated()){
      req.logout();
      req.session.destroy();
      res.json("logged out");
   }
});

router.get("/api/isLoggedIn",function(req,res){
   if(req.isAuthenticated()){
      res.json({ loggedIn: true});
   }else{
      res.json({loggedIn: false});
   }
});

module.exports = router;