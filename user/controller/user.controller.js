const userModel= require("../model/user.model")
const blacklistoken=require("../model/blacklistmodel.model")
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")


module.exports.register= (async (req,res)=>{
     try{
        const {name,email,password}=req.body
        const user=await userModel.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exist"})
        }
        else{
             const hash=await bcrypt.hash(password,10);
            const newUser= new userModel({name,email,password:hash})
            await newUser.save()
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            res.cookie("token",token);
            res.send({status:true,message:"User registered successfully",token:token})
        }
     }
     catch(e){
        res.status(500).json({message:"OOPS sommething went wrong",error:e})
         console.log(e)
     }
})

module.exports.login=(async (req,res)=>{
    try{
        const {email,password}=req.body;
        
        const user=await userModel.findOne({email})
        
        if(!user){
             return res.status(400).json({message:"Invalid credentials"})
        }
        console.log(user)
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        delete user._doc.password;
        res.cookie('token',token)
        res.send({token,user})

    }
    catch(e){
         res.status(500).json({message:e.message})
    }
})


module.exports.logout= async(req,res)=>{
    try{
         const token=req.cookie.token;
         await blacklistoken.create({token})
         res.clearCookie('token');
         res.send({message:'User Logged out succefully'})
    }
    catch(e){
         res.status(500).json({message:error.message})
    }
}