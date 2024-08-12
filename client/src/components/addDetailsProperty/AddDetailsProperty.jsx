import React from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from '@mui/icons-material/Close';
import { IoIosImages } from "react-icons/io";
import "./AddDetailsProperty.css"

export default function AddDetailsProperty(props){

    const {listingDetails, setListingDetails} = props;

    function handleListingType(event){
        const typeOfListing = event.target.value;

        setListingDetails((prevValue)=>{
            return { ...prevValue, listingType: typeOfListing }
        });
    }

    const basicsList = [
        { basicName: "Bedrooms", basicQuant: listingDetails.quantity.bedrooms, key: "bedrooms" },
        { basicName: "Bathrooms", basicQuant: listingDetails.quantity.bathrooms, key: "bathrooms" },
        { basicName: "Drawing Rooms", basicQuant: listingDetails.quantity.drawingRoom, key: "drawingRoom" },
        { basicName: "Kitchens", basicQuant: listingDetails.quantity.kitchen, key: "kitchen" },
        { basicName: "Dining Rooms", basicQuant: listingDetails.quantity.diningRoom, key: "diningRoom" },
        { basicName: "Parkings", basicQuant: listingDetails.quantity.parking, key: "parking" }
    ];

    function decreaseQuant(key){
        setListingDetails((prevValue)=>{
            return {
                ...prevValue,
                quantity:{
                    ...prevValue.quantity,
                    [key]: prevValue.quantity[key] > 0 ? prevValue.quantity[key] - 1 : 0
                }
            }
        })
    }

    function increaseQuant(key){
        setListingDetails((prevValue)=>{
            return {
                ...prevValue, 
                quantity:{
                    ...prevValue.quantity,
                    [key]: prevValue.quantity[key] + 1
                }
            }
        })
    }

    function handleUploadPhotos(event){
        const newPhotos = Array.from(event.target.files);
        setListingDetails((prevValue)=>{
            return {...prevValue, 
                photos: [...prevValue.photos, ...newPhotos]
            }
        })
    }

    function handleRemovePhotos(indextoDel){
        const indexRemove = indextoDel
        setListingDetails((prevValue)=>{
            return {...prevValue, 
                photos: (prevValue.photos.filter((obj , index) => index != indexRemove))
            }
        })
    }

    function handlePrice(event){
        const propertyPrice = event.target.value
        setListingDetails((prevValue)=>{
            return {...prevValue, price: propertyPrice}
        });
    }

    
    return(
        <div className="listing-card">

            <div className="listing-card-head">Step 2: Add details about your property</div>
            <div className="listing-body">

                {/* Type of listing */}
                <div className="listing-type-container">
                    <p className="label-listingInp ">Are you listing your property for rent, sale, or both?</p>
                    <FormControl>
                        <RadioGroup
                            row
                            name="listingTypeGroup"
                            value={listingDetails.listingType}
                            onChange={handleListingType}
                        >
                            <FormControlLabel 
                                value="Rent" 
                                control={<Radio sx={{'& .MuiSvgIcon-root': { fontSize: 20 } }} />}
                                label={<span style={{ fontSize: '0.94rem', fontFamily: 'Nunito Sans, sans-serif' }}>Rent</span>}
                            />
                            <FormControlLabel 
                                value="Sale" 
                                control={<Radio sx={{'& .MuiSvgIcon-root': {fontSize: 20}}}/>} 
                                label={<span style={{ fontSize: '0.94rem', fontFamily: 'Nunito Sans, sans-serif' }}>Sale</span>}
                            />

                        </RadioGroup>
                    </FormControl>
                </div>


                {/* Basic characterestics */}
                <p className="label-listingInp basics-head">Share some basics about your place</p>
                <div className="basicsContainer">
                    {basicsList.map((basics)=>{
                        return(
                            <div className="basics" key={basics.key}>
                                <p className="basic-name"> {basics.basicName} </p>
                                <button className="quantrounded" onClick={()=>{decreaseQuant(basics.key)}}> - </button>
                                <p> {basics.basicQuant} </p>
                                <button className="quantrounded" onClick={()=>{increaseQuant(basics.key)}}> + </button>
                            </div>
                        )   
                    })}
                </div>  


                {/* Add photos */}
                <p className="label-listingInp basics-head photos-head">Add some photos of your place</p>
                
                <div className="photos">

                    <div className="photo-list">
                        {listingDetails.photos.map((photo,index)=>{
                            return(
                                <div className="photo-item" key={index}>
                                    <img src={URL.createObjectURL(photo)} alt="Property-img" />
                                    <button onClick={()=>{handleRemovePhotos(index)}}><CloseIcon /></button>
                                </div>
                            )
                        })}
                        <label htmlFor="fileUpload" className="custom-file-upload">
                            <div className="icon">
                                <IoIosImages />
                            </div>
                            <span>Upload from your device</span>
                        </label>
                        <input type="file" multiple onChange={handleUploadPhotos} id="fileUpload" name="fileUpload"/>
                    </div> 
                </div>

                <p className="label-listingInp basics-head photos-head">Add the Price or Rent/month of your property</p>
                <div className="priceProperty">
                    <span>&#8377;</span>
                    <input type="text" name="price" id="price" className="priceInpt" value={listingDetails.price} onChange={handlePrice} placeholder="0"/>
                </div>
            </div>

        </div>
    )
}