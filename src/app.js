const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();
const path=require('path')
const usermodel=require('./models/user')
const postmodel=require('./models/post');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
})
app.get("/profile", isloggedin,async (req,res)=>{
    let user=await usermodel.findOne({_id:req.user.userid});
    await user.populate("posts");
    res.render("profile",{user});
})
app.get("/like/:id", isloggedin,async (req,res)=>{
    let post=await postmodel.findOne({_id:req.params.id}).populate("user");
    if(post.likes.indexOf(req.user.userid)==-1){
        post.likes.push(req.user.userid);
    }
    else post.likes.splice(post.likes.indexOf(req.user.userid),1);
    await post.save();
    res.redirect("/profile");
})
app.get("/edit/:id", isloggedin,async (req,res)=>{
    let post=await postmodel.findOne({_id:req.params.id}).populate("user");

   res.render("edit",{post})
})
app.post("/edit/:id", isloggedin,async (req,res)=>{
   
    await postmodel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
    res.redirect("/profile");
})

app.post("/create",async (req,res)=>{
    let {name,email,password,username,age}=req.body;
    let person=await usermodel.findOne({email:email})
    if(person) return res.redirect("/login");
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let cruser=await usermodel.create({
            name,
            email,
            password:hash,
            username,
            age
        })
        let token=jwt.sign({email:email,userid:cruser._id},process.env.JWT_SECRET);
        res.cookie("token",token);
        res.redirect("/profile");
        })
    })
})

app.post("/post",isloggedin,async(req,res)=>{
    let user=await usermodel.findOne({_id:req.user.userid});
    let post =await postmodel.create({
        user:user._id,
        content:req.body.content
    })
    user.posts.push(post._id);
    user.save();

    res.redirect("/profile");
})

app.post("/login",async (req,res)=>{
    let {email,password}=req.body;
    let person=await usermodel.findOne({email:email})
    if(person) {
        bcrypt.compare(password,person.password,(err,result)=>{
            if(result){    
                let token=jwt.sign({email:email,userid:person._id},process.env.JWT_SECRET);
                res.cookie("token",token);    
                return res.redirect("/profile/")
            }
            else res.send("email or password is incorrect");    
        })
    }
    else res.send("something went wrong")
})

function isloggedin(req,res,next){
    if(req.cookies.token=="") res.send("YOU must be logged in");
    else{
        let data =jwt.verify(req.cookies.token,process.env.JWT_SECRET);
        req.user=data;
        next();
    }
}

module.exports=app;
