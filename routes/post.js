const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const requireLogin = require("../middleware/requireLogin");
const { post } = require("./auth")
const Post = mongoose.model("Post")
// const Post = require('../models/post');


router.get('/allpost',requireLogin, (req,res)=>{
   Post.find()
   .populate("postedBy","_id name")
   .populate("comments.postedBy","_id name")
   .sort('-createdAt')
   .then(posts=>{
      res.json({posts})
   }).catch(err=>{
      console.log(err)
   })
})

router.get('/getsubpost',requireLogin, (req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .sort('-createdAt')
  .then(posts=>{
     res.json({posts})
  }).catch(err=>{
     console.log(err)
  })
})

router.post("/createpost",requireLogin,(req, res) => {
  const { title,body,pic } = req.body
  console.log(req.body)
  if (!title || !body || !pic) {
    return res
      .status(422)
      .json({ error: "please provide all required fields" });
  }
  req.user.password = undefined
  const post = new Post({
      title,
      body,
      photo:pic,
      postedBy:req.user
  })
  post.save().then(result=>{
    res.json({post:result})
  })
  .catch(err => {
    console.log(err)
  })
})

router.get("/mypost",requireLogin,(req, res) => {
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.user._id } },
    { new: true }
  )
    .exec()
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      return res.status(422).json({ error: err });
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .exec()
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      return res.status(422).json({ error: err });
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments:comment } },
    { new: true }
  ).populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
    .exec()
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      return res.status(422).json({ error: err });
    });
});

router.delete('/deletePost/:postId', requireLogin, async (req, res) => {
  try {
  const post = await Post.findOne({ _id: req.params.postId }).populate("postedBy", "_id").exec();
  if (!post) {
  return res.status(422).json({ error: "Post not found" });
  }
  if (post.postedBy._id.toString() !== req.user._id.toString()) {
  return res.status(401).json({ error: "Unauthorized access" });
  }
   Post.deleteOne({ _id: req.params.postId }).exec()
  .then(result => {
    res.json({ result });
  }).catch(err=>{console.log(err)})
  } catch (err) {
     return res.status(500).json({ error: "Internal server error" });
  }
  });


// router.delete('/deletePost/:postId',requireLogin,(req,res)=> {
//    Post.findOne({_id: req.params.postId})
//    .populate("postedBy","_id")
//    .exec((err,post)=>{
//      if(err || !post){
//       return res.status(422).json({error:err})
//      }
//      if(post.postedBy._id.toString() === req.user._id.toString()){
//       post.remove()
//       .then(result=>{
//         res.json({result})
//       }).catch(err=>{
//         console.log(err)
//       })
//     }
//    })
//   })

module.exports = router
