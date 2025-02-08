const mongoose= require("mongoose")

const otpSchema= new mongoose.Schema({
    otp:{
         type:String,
         require:true
    },
    phoneNumber:{
         type:String,
         required:true
    }
},{
     timestamp:true
})

module.exports= mongoose.model('otp',otpSchema);