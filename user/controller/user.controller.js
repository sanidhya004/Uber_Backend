const userModel= require("../model/user.model")
const otpModel=require("../model/otpmode.mode")
const blacklistoken=require("../model/blacklistmodel.model")
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")

const twilio = require('twilio');
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

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



module.exports.sendOtp= async(req,res,next)=>{
    try{
        const { phoneNumber } = req.body;

        // Validate phone number
        if (!phoneNumber) {
          return res.status(400).json({ error: 'Phone number required' });
        }
    
        // Generate OTP
        const otp_gen = generateOTP();
        const message = `Your verification code is: ${otp_gen}`;
    
        // Send SMS
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });
    
        // Store OTP with expiration (5 minutes)
        const otpmodel= new otpModel({otp:otp_gen,phoneNumber:phoneNumber})
        await otpmodel.save()
       
    
        res.status(200).json({ 
          success: true,
          message: 'OTP sent successfully'
        });
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
}


module.exports.verifyOTP= async(req,res)=>{
    try{
        const {otp}=req.body;
        const result= await otpModel.findOne({otp});
        console.log(result)
        if(result){ 
           await otpModel.deleteOne({otp})
           res.status(200).json({status:true,message:"OTP verified"})
        }
        else{
            res.status(400).json({status:false,message:"Invalid OTP"})
            console.log("no")
        }
     }
     catch(e){
           console.log(e)
     }
}