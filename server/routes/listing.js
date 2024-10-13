const router = require("express").Router();
const Listing = require("../models/Listing");
const User = require('../models/User') 
const uploadToFirebase = require('../middleware/upload');

// Add listing
router.post('/addListing', uploadToFirebase, async(req, res) => {
    try {
        const {
            userRef,
            streetAddress,
            apartment,
            city,
            pincode,
            country,
            listingType,
            quantity,
            price,
            propertyName,
            propertyDesc,
        } = req.body;

        if (!req.uploadedFiles || req.uploadedFiles.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const listingPhotosUrls = req.uploadedFiles;

        let address;
        if (apartment !== '') {
            address = `${apartment}, ${streetAddress}, ${city}, ${country}`;
        } else {
            address = `${streetAddress}, ${city}, ${country}`;
        }
        const parsedQuantity = JSON.parse(quantity);

        const newListing = new Listing({
            userRef: userRef,
            propertyName,
            propertyDescription: propertyDesc,
            address: address,
            typeOfListing: listingType,
            bedrooms: parsedQuantity.bedrooms,
            bathrooms: parsedQuantity.bathrooms,
            drawingRooms: parsedQuantity.drawingRoom,
            kitchens: parsedQuantity.kitchen,
            diningRooms: parsedQuantity.diningRoom,
            parkings: parsedQuantity.parking,
            listingPhotosUrls,
            price
        });

        await newListing.save();

        const user = await User.findOneAndUpdate(
            { email: userRef },
            { $push: { userListings: newListing._id } },
            { new: true }
        );

        res.status(200).json({ message: "New listing created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some server error occurred" });
    }
});


// Get properties
router.get('/properties', async(req,res)=>{
    try{
        const listings = await Listing.find()
        res.status(200).json(listings);
    }
    catch(error){
        res.status(500).json({error: "Error fetching listings"})
    }
})

// Get Single property
router.get('/property/:listingId', async(req, res)=>{
    try{
        const {listingId} = req.params;
        const listing = await Listing.findById(listingId);
        if(!listing){
            return res.status(404).json({error: "Property not found"});
        }
        res.status(200).json(listing);
    }
    catch(error){
        console.log(error)
    }
})

// Check User Listing
router.post('/checkUserListings', async(req,res)=>{
    try{
        const {userEmail} = req.body;
        const userListings = await Listing.find({userRef: userEmail})
        if(!userListings){
            return res.status(200).json({userListings: []})
        }
        return res.status(200).json({userListings})
    }
    catch(error){
        console.log(error)

    }
})

module.exports = router;