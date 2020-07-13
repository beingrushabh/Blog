const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});
const User = require("../models/User");
const s3bucket = require("../config/s3");

router.get("/", (req, res) => {
  User.find().then((result) => {
    // console.log(result);
    res.json(result);
  });
});

router.post("/update-tagline",(req,res)=>{
  const user = req.user;
  User.updateOne({_id : user._id},{tagline : req.body.tagline}).then(()=>{
    res.json({status : "success"});
  }).catch((err)=>{
    res.json({status: err});
  });
});

router.post("/update-profile-pic",upload.single('filename'),async(req,res)=>{
  const user = req.user;
  const url = user.filename;
  const filename = url.substr((url.lastIndexOf("/") + 1));
  const file = req.file;
  const params = {
    Bucket: 'shopin1',
    region:'us-east-1',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const newUrl = "https://shopin1.s3.amazonaws.com/" + params.Key;
  const deleteOldProfile = new Promise(function(resolve,reject){
      s3bucket.deleteObject({
        Bucket : 'shopin1',
        Key : filename
  },function(err,data){
        if(err){
          reject(err);
        }else{
          resolve(data);
        }
      });
  });
  const uploadPromise = new Promise(function(resolve,reject){
           s3bucket.upload(params,function(err,data){
              if(err){
                 reject(err);
              }else{
                 resolve({status : "success"});
              }
           });
        });

  try {
    await deleteOldProfile;

    await uploadPromise;

    await User.updateOne({_id: user._id}, {filename: newUrl});
    res.json({status: "success"});

  }
  catch(e){
    res.json({status : e});
  }
});

router.get("/user-data",(req,res)=>{
  const user = req.user;
  User.findOne({_id : user._id}).then((data)=>{
    res.json({userId : data.userId,tagline : data.tagline,filename : data.filename});
  }).catch((err)=>{
    res.json({status: err});
  });
});


module.exports = router;
