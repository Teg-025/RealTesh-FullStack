const router = require('express').Router();
const User = require('../models/User');
const Listing = require('../models/Listing');

router.post('/isFavourited', async(req,res)=>{
    try{
        const {listingId, userId} = req.body;
        const user = await User.findOne({email: userId})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        const isFavourited = user.wishList.includes(listingId);
        return res.status(200).json({isFavourited});
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
})

router.post('/pushToWishList', async(req, res)=>{
    try{
        const {listingId, userId} = req.body;
        const user = await User.findOne({email: userId})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        if(!user.wishList.includes(listingId)){
            user.wishList.push(listingId);
            await user.save();
            return res.status(200).json({message: "Property added to wishlist"});
        }
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
})

router.post('/deleteFromWishList', async(req,res)=>{
    try{

        const {listingId, userId} = req.body;
        const user = await User.findOne({email: userId})

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        user.wishList = user.wishList.filter( id => id !=listingId);
        await user.save();

        return res.status(200).json({message: "Property removed from wishlist"})
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
})

router.post('/getWishList', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const wishListingsIds = user.wishList;  
        if (wishListingsIds.length === 0) {
            return res.status(200).json({ wishListings: [] });  
        }

        const wishListings = await Listing.find({ _id: { $in: wishListingsIds } });
        return res.status(200).json({ wishListings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;