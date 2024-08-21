import React, {useState, useEffect} from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import SearchIcon from '@mui/icons-material/Search';
import PropertyCard from "./propertyCard/PropertyCard";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import './PropertiesPage.css'

export default function PropertiesPage(){

    const location = useLocation();
    const { type } = location.state || {};

    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        async function fetchData(){
            try{
                const response = await fetch("https://realtesh.onrender.com/get/properties")
                const data = await response.json();
                setListings(data);
            }
            catch(error){
                toast.error("Error fetching data from server!")
                console.log(error)
            }
            finally{
                setIsLoading(false)
            }
        }

        fetchData();
    }, [])
    

    function handleSearchChange(event){
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    }

    const filteredListings = listings.filter(listing => {
        const matchesSearchQuery = 
            listing.propertyName.toLowerCase().includes(searchQuery) ||
            listing.address.toLowerCase().includes(searchQuery) ||
            listing.typeOfListing.toLowerCase().includes(searchQuery);

        const matchesType = 
            type ? listing.typeOfListing.toLowerCase().includes(type) : true;

        return matchesSearchQuery && matchesType;
    })

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
        <div className="properties-page-container">
            <Header />
            <div className="properties-page-body">
                <div className="search-property-container">
                    <div className="search-property-bar">
                        <SearchIcon style={{color: "#1d3895", fontSize: "1.8rem"}} />
                        <input 
                            name="search" 
                            id="search" 
                            className="search-location search-property" 
                            type="text" 
                            placeholder="Search by Title | City | Country | Rent | Sale"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button className="btn-no-hover search-property-btn" text="Search">Search</button>
                    </div>
                </div>
            </div>

            <div className="flex-center-properties-page">
                <div className="properties-list">
                    {filteredListings.map((listing) => {
                        
                        return(
                            <PropertyCard
                                listing={listing}
                                ImageUrls={listing.listingPhotosUrls}
                                key={listing._id} 
                            />
                        )

                    })}
                </div>
                
            </div>
            <Footer />

        </div>        
    )
}