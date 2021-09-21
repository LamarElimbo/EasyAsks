const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    requestsFulfilled: {
        type: [String],
    },
    requestsPosted: {
        type: [String,],
    },
    availablePoints: {
        type: Number
    }
})
module.exports = mongoose.model("User", userSchema)