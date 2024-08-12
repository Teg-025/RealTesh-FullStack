const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Register User
router.post("/register", async(req,res)=>{
    try{
        // Take all info from the form by destructuring
        console.log("Received registration data:", req.body);
        const { firstName, lastName, email, password} = req.body

        // Check if the user exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({message: "User already exists"})
        }

        // If user doesn't exist hash the password for better security
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user entry in the database
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        // Save the new user
        await newUser.save()
        res.status(200).json({message: "User Registered successfully", user: newUser})
    }
    catch(error){
        console.log(error);
    }
})

// Login User
router.post("/login", async(req,res)=>{
    try{
        const {email, password} = req.body

        // Verify if user exists
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({successful: 0, message: "Invalid email please try again"})
        }

        // Match password with hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if(!isMatch){
            return res.status(400).json({successful: 0, message: "Invalid password please try again"})
        }

        // Generate JWT token to be used to authenticate identity of user in future transactions
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET)
        delete existingUser.password

        res.status(200).json({successful: 1, token, existingUser, message: "Successfull login"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: error.message})
    }
})

module.exports = router;