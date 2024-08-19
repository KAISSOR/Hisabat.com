const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    CoName:{
        type: String,
        required: true,
    },
    CoCode:{
        type: String,
        required: true,
    },
    CoPassword:{
        type: String,
        required: true,
    },
    CoImage: {
        type:String, 
    },
});

module.exports = mongoose.model("Company", companySchema);

