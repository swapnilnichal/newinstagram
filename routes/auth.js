const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys")
const requireLogin = require("../middleware/requireLogin");

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

module.exports = router;
