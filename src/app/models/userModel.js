const { Int32 } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    id: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    storeName: {
        type: String,
        required: false,
        trim: true,
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
        required: true,
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model('Users', UserSchema)