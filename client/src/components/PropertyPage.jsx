import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Map from '../components/map/Map';
import FavoriteButton from "./favouriteButton/FavouriteButton";
import BookingModal from "./bookingModal/BookingModal";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import ImageCarousel from './imageCarousel/ImageCarousel'
import './PropertyPage.css';

// Icons
import FilterIcon from '@mui/icons-material/Filter';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChairIcon from '@mui/icons-material/Chair';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function PropertyPage() {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 480);

    useEffect(() => {
        function handleResize() {
            setIsSmallScreen(window.innerWidth < 480);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // Clean up listener
    }, []);

    useEffect(() => {
        async function fetchProperty() {
            try {
                const response = await fetch(`https://realtesh.onrender.com/get/property/${listingId}`);
                const data = await response.json();
                setListing(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProperty();
    }, [listingId]);

    if (isLoading) {
        return (
            <div className="property-page-container">
                <Header />
                <div className="flexCenter">
                    <PuffLoader 
                        height={80}
                        width={80}
                        radius={1}
                        color="#4066ff"
                        aria-label="puff-loading"
                    />
                </div>
                <Footer />
            </div>
        );
    }

    function makeBooking() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            toast.error("Please login to make a booking!");
            return;
        }

        setIsModalOpen(true);
    }

    const imageUrls = listing.listingPhotosUrls;
    const displayedImages = showAllImages ? imageUrls : imageUrls.slice(0, 5);

    return (
        <div className="property-page-container">
            {
                !showAllImages
                ? <>
                        <Header />
                        <div className="property-page-body">
                            <div className="property-heading">
                                <div className="propertyPage-propertyName">{listing.propertyName}</div> 
                                {
                                    !isSmallScreen && <FavoriteButton color={"black"} listingId={listing._id} />
                                }
                            </div>
                            {
                                !isSmallScreen
                                ? <div className={`property-images-grid ${showAllImages && 'show-all-images'}`}>
                                    {displayedImages.map((imageUrl, index) => (
                                        <div className="property-image" key={index}>
                                            <img src={imageUrl} alt={`property-img-${index}`} />
                                        </div>
                                    ))}
                                    {!showAllImages && imageUrls.length > 5 && (
                                        <button className="show-more-btn" onClick={() => setShowAllImages(true)}>
                                            <FilterIcon /> Show all photos
                                        </button>
                                    )}
                                </div>
                                : <ImageCarousel images={imageUrls} listingId={listing._id} />
                            }
                            <div className="property-info-container">
                                <div className="property-info">
                                    <div className="property-basics">
                                        {listing.bedrooms > 0 && <p className="property-basic"><BedIcon /> {listing.bedrooms} Bedrooms</p>}
                                        {listing.bathrooms > 0 && <p className="property-basic"><BathtubIcon /> {listing.bathrooms} Bathrooms</p>}
                                        {listing.kitchens > 0 && <p className="property-basic"><KitchenIcon /> {listing.kitchens} Kitchen</p>}
                                        {listing.drawingRooms > 0 && <p className="property-basic"><ChairIcon /> {listing.drawingRooms} Drawing Room</p>}
                                        {listing.diningRooms > 0 && <p className="property-basic"><DinnerDiningIcon /> {listing.diningRooms} Dining Room</p>}
                                        {listing.parkings > 0 && <p className="property-basic"><TimeToLeaveIcon /> {listing.parkings} Parking</p>}
                                    </div>
                                    <div className="property-type-and-price">
                                        <MonetizationOnIcon />
                                        <span className="property-type">{listing.typeOfListing}</span> 
                                        <span className="property-price"> &#8377;{listing.price}</span>
                                        {listing.typeOfListing === "Rent" && <span className="property-price per-month">per month</span>}
                                    </div>
                                    <div className="property-desc">{listing.propertyDescription}</div>
                                    <div className="property-location"><FmdGoodIcon />{listing.address}</div>
                                    <button className="booking-btn" onClick={makeBooking}>Book your visit</button>
                                </div>
                                <div className="property-map">
                                    <Map address={listing.address} />
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </>
                    
                :   <div className="image-modal">
                        <button className="close-modal-btn" onClick={() => setShowAllImages(false)}>
                            <ArrowBackIosNewIcon />
                        </button>
                        <div className="image-modal-content">
                            {imageUrls.map((imageUrl, index) => (
                                <img src={imageUrl} alt="property-img" key={index} />
                            ))}
                        </div>
                    </div>
            }
            <BookingModal 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                listingId={listingId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </div>
    );
}
