const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const listingRoute = require("./routes/listing");
app.use("/create", listingRoute);
app.use("/get", listingRoute);

const wishListRoute = require("./routes/wishList");
app.use("/wishList", wishListRoute);

const bookingsRoute = require('./routes/booking');
app.use(bookingsRoute);

// Upload images from public folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mongoose Setup
mongoose.connect(process.env.MONGO_URI, { dbName: "RealTesh"})
    .then(()=>{
        app.listen(PORT, ()=>{
            console.log("Server is running on "+PORT);
        });
    })
    .catch((error)=>{
        console.log(error);
    });
    
module.exports = app;