const mongoose = require('mongoose')

const fulfillmentSchema = new mongoose.Schema({
    fulfilledBy: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
})

const requestSchema = new mongoose.Schema({
    requiresValidation: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    postedBy: {
        type: String,
        required: true
    },
    pointsSpent: {
        type: Number,
        default: 3
    },
    fulfillment: {
        type: [fulfillmentSchema]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expirationDate: {
        type: Date,
        default: () => Date.now() + 7*24*60*60*1000 // Converts 7 days to milliseconds and adds it onto today's date
    },
    stripeSessionIds: {
        type: [String]
    },
    expired: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Request', requestSchema)