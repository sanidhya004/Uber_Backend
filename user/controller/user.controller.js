const userModel= require("../model/user.model")
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