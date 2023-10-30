const mongoose = require('mongoose')


const userSchema = mongoose.Schema({

    name: {
        type: String,
        unique: true,
        required: true

    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    joindDate: { type: Date, default: Date.now },

    sentFollowRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    receivedFollowRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],


    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User;