const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Create server instance for Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Routes
const authRoutes = require("./routes/auth")
app.use("/auth", authRoutes)

const ListingRoute = require("./routes/listing")
app.use("/create", ListingRoute)
app.use("/get", ListingRoute)

const wishListRoute = require("./routes/wishList")
app.use("/wishList", wishListRoute)

const {router: bookingsRoute, setupSocket} = require('./routes/booking');
app.use(bookingsRoute)
setupSocket(io);

// Upload images from public folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mongoose Setup
mongoose.connect(process.env.MONGO_URI, { dbName: "RealTesh"})
    .then(()=>{
        server.listen(PORT, ()=>{
            console.log("Server is running on "+PORT)
        })
    })
    .catch((error)=>{
        console.log(error)
    })