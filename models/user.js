const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type: String,
        default: "https://res.cloudinary.com/dc42djaq0/image/upload/v1686986461/avatar-3814081_1280_cny958.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]

})

// const User = mongoose.model("User", userSchema)
module.exports = mongoose.model('User', userSchema);