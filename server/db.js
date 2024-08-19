const mongoose = require("mongoose");

module.exports = () =>{
    try {
        mongoose.connect(process.env.DB );
        console.log("connected to database successfully")
    } catch(error){
        console.log(error);
        console.log("could not connect to datebase")
    }
}