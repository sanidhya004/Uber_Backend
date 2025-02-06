const dotenv=require("dotenv")
dotenv.config()
const express= require("express")
const app= express()
const userRouter=require("./routes/user.routes")
const cookieParser=require("cookie-parser")
const connect=require("./db/db")

app.use(express.json)
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/',(req,res,next)=>{
   res.send(200).json({message:"Server Running"})
})
app.use('/user',userRouter)
connect()

module.exports=app