import React from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../imageCarousel/ImageCarousel";
import './PropertyCard.css'

export default function PropertyCard(props) {
    const { listing, ImageUrls} = props;
    const navigate = useNavigate();

    function handleCardClick(event){
        navigate(`/properties/${listing._id}`);
    };

    return (
        <div className="property-card" >
            <ImageCarousel images={ImageUrls} listingId={listing._id} handleCardClick={handleCardClick}/>
            <div className="property-card-body" onClick={handleCardClick}>
                <div className="display-property-name">{listing.propertyName}</div>
                <p className="display-property-address">
                    {
                        listing.address.length>38
                        ? <p>{listing.address.slice(0, 38)}. . . .</p>
                        : <p>{listing.address}</p>
                    }
                </p>
                <p className="display-property-type">{listing.typeOfListing}</p>
                <span className="display-property-price">&#8377;{listing.price}</span>
                {listing.typeOfListing === "Rent" && <span className="display-property-price">/month</span>}
            </div>
        </div>
    )
}
