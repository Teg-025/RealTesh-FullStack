const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
    {
        userRef: {
            type: String,
            requirted: true
        },
        propertyName: {
            type: String,
            required: true
        },
        propertyDescription: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        typeOfListing: {
            type: String,
            required: true
        },
        bedrooms: {
            type: Number
        },
        bathrooms: {
            type: Number
        },
        drawingRooms: {
            type: Number
        },
        kitchens: {
            type: Number
        },
        diningRooms: {
            type: Number
        },
        parkings:{
            type: Number
        },
        listingPhotosUrls:{
            type: Array,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        bookings:{
            type: [{
                userId: {
                    type: String
                },
                date:{
                    type: String
                },
                time:{
                    type: String
                }
            }],
            default: []
        }
    },
    {timestamps: true}
)

const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing;