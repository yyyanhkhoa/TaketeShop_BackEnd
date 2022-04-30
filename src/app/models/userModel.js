const mongoose = require('mongoose')
const shortID = require('short-id')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    userID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: shortID.generate(),
    },
    storeName: {
        type: String,
        required: false,
        trim: true,
        default: 'NoStoreBruhhh'
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: Boolean,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['SHOP','STAFF','CUSTOMER','BANNED'],
        default: 'CUSTOMER'
    },
     createAt:{
        type:Date,
        default:Date.now,
        required: true
    },
},
//  {
//     timestamps: true,}
)

module.exports = mongoose.model('Users', UserSchema)