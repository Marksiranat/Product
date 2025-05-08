const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchma = new Schema({
    username: {type: String},
    email: {type: String},
    name: {type: String},
    password: {type: String},
    status: {type: String ,enum:['Approve', 'NoApprove'],default :'NoApprove'}
   
},{
    timestamps: true
})


module.exports = mongoose.model('user',userSchma)
