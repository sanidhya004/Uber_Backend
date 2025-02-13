const express=require("express")
const router=express.Router();
const userController= require("../controller/user.controller")



router.post("/register",userController.register)

router.get("/heartbeat",((req,res)=>{
    console.log("running check")
     res.status(200).json({message:"server running"})
}))

router.post('/login',userController.login)
router.post("/logout",userController.logout)
router.post("/sendotp",userController.sendOtp)
router.post("/verify-otp",userController.verifyOTP)

module.exports=router
