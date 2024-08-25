const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const nodemailer = require('nodemailer');
const User = require('../models/User');

let io;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'realtesh.confirm@gmail.com',
        pass: 'gvzy fpnj beio vpgd'
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

async function sendBookingEmail(to, subject, text){
    const mailOptions = {
        from: 'realtesh.confirm@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    try{
        await transporter.sendMail(mailOptions);
        console.log('Email Sent');
    }
    catch(error){
        console.error('Error sending email: ', error);
    }
}

function setupSocket(socketIoInstance){
    io = socketIoInstance;

    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

router.post('/checkBooking/:listingId', async (req, res) => {
    const { listingId } = req.params;
    const { date } = req.body;
    const nonAvailableTimes = [];

    try {
        const listing = await Listing.findById(listingId);
        
        if (!listing) {
            return res.status(404).json({ message: "Listing doesn't exist" });
        }

        const selectedDate = new Date(date).toLocaleDateString('en-CA').slice(0, 10);

        const bookedTimesforDate = listing.bookings.filter((booking) => {
            return new Date(booking.date).toLocaleDateString('en-CA').slice(0, 10) === selectedDate;
        });

        bookedTimesforDate.forEach((booking) => {
            nonAvailableTimes.push(booking.time);
        });
        
        const availableTimes = [];
        for (let hour = 9; hour <= 19; hour++) {
            const timeString = `${hour} : 00`;
            availableTimes.push({
                label: timeString,
                available: !nonAvailableTimes.includes(timeString)
            });
        }

        return res.status(200).json({ availableTimes });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/getUnavailableDates/:listingId', async (req, res) => {
    const { listingId } = req.params;
    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing doesn't exist" });
        }

        const bookingCount = new Map();
        const unAvailableDates = [];

        listing.bookings.forEach(booking => {
            const bookingDate = new Date(booking.date).toDateString();
            if (bookingCount.has(bookingDate)) {
                bookingCount.set(bookingDate, bookingCount.get(bookingDate) + 1);
            } else {
                bookingCount.set(bookingDate, 1);
            }
        });

        bookingCount.forEach((count, date) => {
            if (count >= 2) {
                unAvailableDates.push(date);
            }
        });

        return res.status(200).json({ unAvailableDates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/book/:listingId', async (req, res) => {
    const { listingId } = req.params;
    const { userId, date, time } = req.body;
    const emails = [
        sendBookingEmail(userId, 'Booking Confirmation', `Your booking for ${date} at ${time} has been confirmed`),
        sendBookingEmail(listingId.userRef, 'New Booking Received', `A new booking has been made for your listing on ${date} at ${time}`)
    ];

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing doesn't exist" });
        }

        listing.bookings.push({ userId, date, time });
        await listing.save();
        await Promise.all(emails);

        io.emit('bookingUpdated', { date, time});

        res.status(200).json({ message: "Booking successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = { router, setupSocket };