const express = require("express")
const router = express.Router();
const Listing = require("../models/Listing");
const nodemailer = require('nodemailer');
const User = require('../models/User');
const http = require('http')
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'realtesh.confirm@gmail.com',
        pass: 'gvzy fpnj beio vpgd'
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
})

async function sendBookingEmail(to, subject, text){
    const mailOptions = {
        from: 'realtesh.confirm@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    try{
        await transporter.sendMail(mailOptions);
        console.log('Email Sent')
    }
    catch(error){
        console.error('Error sending email: ', error);
    }
}

io.on('connection', (socket)=>{
    console.log('User connected');

    socket.on('disconnect', ()=>{
        console.log('User dissconnected');
    })
})


router.post('/checkBooking/:listingId', async(req,res)=>{

    const {listingId} = req.params;
    const {date} = req.body;
    const nonAvailableTimes = [];

    try{
        const listing = await Listing.findById(listingId);
        
        if(!listing) {
            return res.status(404).json({message: "Listing doesn't exist"});
        }

        const selectedDate = new Date(date).toLocaleDateString('en-CA').slice(0, 10);

        // .some() is the same as forEach with a return statement
        const bookedTimesforDate = listing.bookings.filter((booking) => {
            return new Date(booking.date).toLocaleDateString('en-CA').slice(0, 10) === selectedDate;
        })

        bookedTimesforDate.map((booking) => {
            return (nonAvailableTimes.push(booking.time));
        });
        
        const availableTimes = [];
        for(let hour=9; hour<=19; hour++){
            const timeString = `${hour} : 00`;
            availableTimes.push({
                label: timeString,
                available: !nonAvailableTimes.includes(timeString)
            })
        }

        return res.status(200).json({availableTimes})

    }
    catch(error){
        console.log(error);
    }
})


router.get('/getUnavailableDates/:listingId', async(req,res)=>{
    const {listingId} = req.params;
    try{
        const listing = await Listing.findById(listingId);
        if(!listing){
            return res.status(404).json({message: "Listing doesn't exist"})
        } 

        // Using hashMap to store frequency of each date
        // the basic idea is that each date if re-appears means it 
        // has a different time (as same time caan't be repeated)

        const bookingCount = new Map();
        const unAvailableDates = [];

        listing.bookings.forEach(booking=>{
            const bookingDate = new Date(booking.date).toLocaleDateString('en-CA').slice(0,10);

            if(!bookingCount.has(bookingDate)){ bookingCount.set(bookingDate, 0); }
            bookingCount.set(bookingDate, bookingCount.get(bookingDate)+1);
        })

        // Here forEach has value,key instead of key,value
        bookingCount.forEach((count, date)=>{
            if(count>=11){
                unAvailableDates.push(date);
            }
        })

        return res.status(200).json({unAvailableDates});
    }
    catch(error){
        console.log(error);
    }
})


router.post('/book/:listingId', async(req,res)=>{
    const {listingId} = req.params;
    const {userId, date, time} = req.body;
    const emails = [
        sendBookingEmail(userId, 'Booking Confirmation', `Your booking for ${date} at ${time} has been confirmed`),
        sendBookingEmail(listingId.userRef, 'New Booking Received', `A new booking has been made for your listing on ${date} at ${time}`)
    ];

    try{
        const listing = await Listing.findById(listingId);
        if(!listing) {
            return res.status(404).json({message: "Listing doesn't exist"});
        }

        listing.bookings.push({userId, date, time});
        await listing.save();
        await Promise.all(emails);

        io.emit('bookingUpdated', {date, time})

        res.status(200).json({message: "Booking successful"});
    }
    catch(error){
        console.log(error)
    }
})


module.exports = router;