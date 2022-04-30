const mongoose = require('mongoose')
const chanelSchema = require('./chanelModel')
const userSchema = require('./userModel.js')

const messSchema = new mongoose.Schema({
    messId:{
        type: mongoose.Schema.Types.ObjectId,       
        required: true
    },   
    userId:{
        type: Int16Array,
        ref:'Users',
        required: true
    },   
    isStaff:{
        type: Boolean,
        default : false,
        required: true
    }
    createAt:{
        type:Date,
        default:Date.now,
        required: true
    },
})

module.exports = mongoose.model('Message',chanelSchema);
