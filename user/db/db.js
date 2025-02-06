const mongoose = require("mongoose");
function connect() {
  mongoose.connect(process.env.MONGO_URI).then(()=>{
     console.log("connected to mongo server")
  }).catch((err)=>{ 
    console.log('error=>',err)
  })
}


module.exports=connect