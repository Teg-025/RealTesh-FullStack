import React, { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import './BookingModal.css';

export default function BookingModal(props) {
    const { listingId, isModalOpen, setIsModalOpen, setIsLoading } = props;
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = loggedInUser ? loggedInUser.email : null; // Check if userId exists
    const currDate = new Date();

    const [selectedDate, setSelectedDate] = useState(currDate);
    const [selectedTime, setSelectedTime] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);

    useEffect(() => {
        const socket = io("https://realtesh.onrender.com");

        console.log('Connecting to socket...');
        socket.on("connect", () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on("bookingUpdated", ({ date, time, listingId }) => {
            console.log('Booking updated event received:', { date, time, listingId });
            if (new Date(date).toDateString() === selectedDate.toDateString()) {
                setAvailableTimes(prevTimes => {
                    const updatedTimes = prevTimes.map(t =>
                        t.label === time ? { ...t, available: false } : t
                    );
                    
                    // If the currently selected time is booked, find the next available time
                    if (selectedTime === time) {
                        const nextAvailableTime = updatedTimes.find(t => t.available);
                        if (nextAvailableTime) {
                            setSelectedTime(nextAvailableTime.label);
                        }
                    }

                    return updatedTimes;
                });
            }
        });

        return () => {
            console.log('Disconnecting from socket...');
            socket.disconnect();
        };
    }, [selectedDate, selectedTime]);

    async function fetchUnavailableDates() {
        try {
            const response = await fetch(`https://realtesh.onrender.com/getUnavailableDates/${listingId}`);
            const data = await response.json();
            setUnavailableDates(data.unAvailableDates);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchAvailableTimes() {
            try {
                // Only if user is logged In
                if (userId) { 
                    const response = await fetch(`https://realtesh.onrender.com/checkBooking/${listingId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ date: selectedDate })
                    });

                    const data = await response.json();
                    setAvailableTimes(data.availableTimes);

                    if (data.availableTimes.length > 0 && !selectedTime) {
                        const firstAvailableTime = data.availableTimes.find(time => time.available);
                        if (firstAvailableTime) {
                            setSelectedTime(firstAvailableTime.label);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (selectedDate) {
            fetchAvailableTimes();
        }
        fetchUnavailableDates();

    }, [selectedDate, userId, listingId, selectedTime]);

    async function bookVisit() {
        if (!userId) {
            toast.error("Please login to make a booking!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`https://realtesh.onrender.com/book/${listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId, date: selectedDate.toLocaleDateString('en-CA'), time: selectedTime })
            });

            if (response.ok) {
                toast.success("A booking has been made!");
                toast.success("An email has been sent to you for the same!");
                setIsModalOpen(false);
            } else {
                toast.error("Please try again!");
            }
        } catch (error) {
            console.error(error);
        }
        setSelectedDate(currDate);
        setSelectedTime("");
        setIsLoading(false);
    }

    function handleDateChange(date) {
        setSelectedDate(date);
        setSelectedTime("");
    }

    function handleTimeChange(event) {
        const time = event.target.value;
        setSelectedTime(time);
    }

    function tileDisabled({ date, view }) {
        if (view === 'month') {
            return unavailableDates.some((unavailableDate) => {
                return new Date(unavailableDate).toDateString() === date.toDateString();
            });
        }
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            title="Select your Date and Time of visit"
            appElement={document.getElementById('root')}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                },
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'fit-content',
                    height: 'fit-content',
                    border: '1px solid #ccc',
                    borderRadius: "0.6rem"
                }
            }}
        >
            <div className="flex-container">
                <div className="select-date">Select Date of your visit</div>
                <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={currDate}
                    tileDisabled={tileDisabled}
                />
                <div className="select-time">Select Time of your visit</div>
                <select name="selectedTime" id="selectedTime" value={selectedTime} onChange={handleTimeChange}>
                    {availableTimes.map((time) => {
                        return (
                            <option value={time.label} key={selectedDate + time.label} disabled={!time.available} id="setTime">
                                {time.label}
                            </option>
                        );
                    })}
                </select>
                <div className="buttonContainer">
                    <button className="booking-btn" onClick={bookVisit}>
                        Book the visit
                    </button>
                </div>
                <button className="close-calendar-modal-btn" onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                </button>
            </div>
        </Modal>
    );
}