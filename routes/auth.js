const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const {JWT_SECRET} = require("../config/keys")
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { time } = require("console");
const {SENDGRID_API,EMAIL} = require("../config/keys")


const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:SENDGRID_API
  }
}))

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "please enter all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User is already registered with this email id" });
      }
      bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email,
          password:hashedPassword,
          name,
          pic
        })
        user.save()
        .then(user => {
            transporter.sendMail({
              to: user.email,
              from:"swapnilnichal10@gmail.com",
              subject:" Welcome aboard! Your successful sign-up.",
              html:"<h1>welcome to instagram!</h1><br><p>Congratulations and welcome to our community! We're thrilled to inform you that your sign-up process was successful. It's a pleasure to have you as a new member.</p><br><p>As part of our community, you now have access to a range of exciting features and exclusive content. Whether you're here to connect with like-minded individuals, explore new opportunities, or expand your horizons, we're here to support you every step of the way.</P>"
            })
            res.json({ message: "saved successfully" });
          })
          .catch(err => {
            console.log(err)
          })
      })
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin",(req,res)=>{
   const {email,password} = req.body
   if(!email || !password){
    return res.status(422).json({ error: "please provide email and password"})
   }
   User.findOne({ email: email})
   .then(savedUser=>{
      if(!savedUser){
        return res.status(422).json({ error: "Invalid email or password"})
      }
      bcrypt.compare(password,savedUser.password)
      .then(doMatch=>{
        if(doMatch){
          // savedUser.password = undefined
          const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
          const {_id,name,email,followers,following,pic} = savedUser
          res.json({token,user:{_id,name,email,followers,following,pic}})
        }
        else{
          return res.status(422).json({ error: "Invalid email or password"})
        }
      }).catch(err=>{
        console.log(err);
      })
   })
})

router.post("/reset-password",(req,res)=>{
   crypto.randomBytes(32,(err,buffer)=>{
      if(err){
        console.log(err);
      }
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then((user)=>{
        if(!user){
          return res.status(422).json({ error: "User don't exist with this email address."})
        }
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        user.save().then((result)=>{
          transporter.sendMail({
              to: user.email,
              from:"swapnilnichal10@gmail.com",
              subject:"Password Reset",
              html: `<h4>You have requested for password reset</h4>
                     <p>click on this <a href="${EMAIL}/reset/${token}">Link</a> to reset your Password.</p>
                    `
          })
          res.json({message:"please check your Email."})
        })
      })
   })
})

router.post("/new-password",(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      return res.status(422).json({error:"Try again ! your session expired."})
    }
    bcrypt.hash(newPassword,12).then(hashedpassword=>{
      user.password = hashedpassword
      user.resetToken = undefined
      user.expireToken = undefined
      user.save().then((saveduser)=>{
         res.json({message:"password updated successfully"})
      })
    })
  }).catch(err=>{
    console.log(err)
  })
})

module.exports = router;
