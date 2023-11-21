const mongoose = require('mongoose')

// Function to connect to the MongoDB database
const dbConnect = ()=>{
    try{
        mongoose.connect(process.env.MONGO_URI,
        )
        console.log('DB connected')
    }catch(err){
        console.log('DB not connected')
        console.log(err)
    }
}
module.exports = dbConnect