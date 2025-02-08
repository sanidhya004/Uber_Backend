const express=require("express")
const router=express.Router();
const userController= require("../controller/user.controller")



router.post("/register",userController.register)

router.get("/heartbeat",((req,res)=>{
    console.log("running check")
     res.status(200).json({message:"server running"})
}))




module.exports=router
