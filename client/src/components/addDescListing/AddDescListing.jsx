import React from "react";
import './AddDescListing.css'

export default function AddDescListing(props){

    const {propertyDesc, setPropertyDesc} = props;

    function handlePropertyDesc(event){
        const {name,value} = event.target;
        setPropertyDesc((prevValue)=>{
            return {...prevValue, [name]: value}
        })
    }

    return(
        <div className="listing-card">

            <div className="listing-card-head">Step 3: Devise a catchy name and decription for your place visible to others</div>
            <div className="listing-body">
                
            <p className="label-listingInp">Title</p>
            <input type="text" value={propertyDesc.propertyName} onChange={handlePropertyDesc} className="listingInp" name="propertyName"/>

            <p className="label-listingInp descLabel">Short Decsription</p>
            <textarea name="propertyDesc" id="propertyDesc" value={propertyDesc.propertyDesc} onChange={handlePropertyDesc} rows={4} cols={4} ></textarea>
                
            </div>

        </div>
    )
}