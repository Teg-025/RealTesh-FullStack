import React from "react";
import Map from "../map/Map";
import "./AddLocation.css"

export default function AddLocation(props){

    const {location, setLocation} = props;

    function handleChange(event){
        const {name, value} = event.target
        setLocation((prevValue)=>{
            return {...prevValue, [name]: value}
        })
    }

    return(
        <div className="listing-card">
            <div className="listing-card-head">Step 1: Add the Location of the property</div>

            <p className="label-listingInp">Street Address</p>
            <input 
                type="text"  
                placeholder="Street Address" 
                className="listingInp"
                name="streetAddress"
                required
                onChange={handleChange}
                value={location.streetAddress}
            />

            <div className="location-input-container">
                <div className="location-small-input-container">
                    <p className="label-listingInp">Apartment, Suite, etc (If applicable)</p>
                    <input 
                        type="text"  
                        placeholder="Apt. , Suite, etc (If appilcable)" 
                        className="small-listingInp"
                        name="apartment" 
                        onChange={handleChange}
                        value={location.apartment}
                    />
                </div>
                <div className="location-small-input-container">
                    <p className="label-listingInp">City</p>
                    <input 
                        type="text"  
                        placeholder="City" 
                        className="small-listingInp"
                        name="city"
                        required
                        onChange={handleChange}
                        value={location.city}
                    />
                </div>
            </div>

            <div className="location-input-container">
                <div className="location-small-input-container">
                    <p className="label-listingInp">Pincode of your area (optional)</p>
                    <input 
                        type="text"  
                        placeholder="Pincode (optional)" 
                        className="small-listingInp"
                        name="pincode"
                        onChange={handleChange}
                        value={location.pincode}
                    />
                </div>
                <div className="location-small-input-container">
                    <p className="label-listingInp">Country</p>
                    <input 
                        type="text"  
                        placeholder="Country" 
                        className="small-listingInp"
                        name="country"
                        required
                        onChange={handleChange}
                        value={location.country}
                    />
                </div>
            </div>
            <div className="map-component">
                <Map 
                    apartment = {location.apartment}
                    address = {location.streetAddress}
                    city = {location.city}
                    country = {location.country}
                />
            </div>

        </div>
    )
}