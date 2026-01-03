const mongoose = require('mongoose');

async function connectionDB(url) {
    await mongoose.connect(url).then(()=> console.log("DB connected")).catch((e)=> console.log("error",e))
}


module.exports={
    connectionDB
}