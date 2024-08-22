import React, { useEffect, useState } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer"
import { PuffLoader } from "react-spinners";
import AddLocation from "./addLocation/AddLocation";
import AddDetailsProperty from "./addDetailsProperty/AddDetailsProperty";
import AddDescListing from "./addDescListing/AddDescListing";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import "./AddListingPage.css";

export default function AddListingPage(){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('loggedInUser')){
            setIsLoggedIn(true)
        }
        else{
            reRouteHomePage()
        }
    }, [])

    function reRouteHomePage(){
        navigate('/')
        toast.error('Please login to create listing!')
    }

    // Transfered all useStates to start as it would be easier to directly access them from here and send back data to server

    // For location
    const [location, setLocation] = useState({
        streetAddress: "",
        apartment: "",
        city: "",
        pincode: "",
        country: ""
    })

    // For basics
    const [listingDetails, setListingDetails] = useState({
        listingType: "",
        quantity: {
            bedrooms: 0,
            bathrooms: 0,
            drawingRoom: 0,
            kitchen: 0,
            diningRoom: 0,
            parking: 0
        },
        photos: [],
        price: 0
    });

    // For property description
    const [propertyDesc, setPropertyDesc] = useState({
        propertyName: "",
        propertyDesc: ""
    });


    async function handleSubmit(){
        setIsLoading(true);
        try{

            const formData = new FormData();

            formData.append('userRef', JSON.parse(localStorage.getItem('loggedInUser')).email)
            formData.append('streetAddress', location.streetAddress);
            formData.append('apartment', location.apartment);
            formData.append('city', location.city);
            formData.append('pincode', location.pincode);
            formData.append('country', location.country);

            formData.append('listingType', listingDetails.listingType);
            formData.append('quantity', JSON.stringify(listingDetails.quantity));
            formData.append('price', listingDetails.price);

            listingDetails.photos.forEach((photo) =>{
                return formData.append('photos', photo)
            })
            
            formData.append('propertyName', propertyDesc.propertyName);
            formData.append('propertyDesc', propertyDesc.propertyDesc);

            const response = await fetch("https://realtesh.onrender.com/create/addListing", {
                method: 'POST',
                body: formData
            })
            if(response.ok){
                toast.success("Listing created successfully!")
            }
        }
        catch(error){
            console.log(error);
            toast.error("Error creating listing!")
        }
        finally{
            setIsLoading(false)
        }
    }

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

    return(

        isLoggedIn
        &&
        <div className="listing-page-conatiner">

            <Header />

            <div className="create-listing-body">

                <div className="head">Create a Listing</div>
                <AddLocation location = {location} setLocation = {setLocation}/>
                <AddDetailsProperty listingDetails={listingDetails} setListingDetails={setListingDetails} />
                <AddDescListing propertyDesc={propertyDesc} setPropertyDesc={setPropertyDesc} />
                <div className="btn-container">
                    <button className="btn" onClick = {handleSubmit}>Create Listing</button>
                </div>
            </div>

            <Footer />

        </div>
    )
}