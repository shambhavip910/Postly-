const mongoose=require('mongoose');
const { ref } = require('process');

mongoose.connect("mongodb://127.0.0.1:27017/miniprojectme");

const userschema=mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    age:Number,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]
})

module.exports=mongoose.model("user",userschema);