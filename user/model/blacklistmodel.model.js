const mongoose= require("mongoose")

const blacklistScehma= new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    createdAt:{
         type:Date,
         default:Date.now,
         expires:3600 
    }
},{
    timestamp:true
})

module.exports= mongoose.model('blacklistoken',blacklistScehma)