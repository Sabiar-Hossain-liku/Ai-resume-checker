const mongoose = require("mongoose")


async function connectToDB() {

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to DB")
    }
    catch(err){
        console.log(err)
    }
}

module.exports= connectToDB