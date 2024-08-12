import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import GeoMarker from "../geoMarker/GeoMarker";
import opencage from 'opencage-api-client';


export default function Map(props) {
    
    const { apartment, address, city, country } = props;
    const [location, setLocation] = useState([51.4, 19.4])

    useEffect(()=>{
        async function fetchCoordinates(){
            try{
                const apiKey = "36dddcc513ac40bca8260134a17f6085";
                const locationResponse = await opencage.geocode({q: `${apartment} ${address}, ${city}, ${country}`, key: apiKey})
                if(locationResponse.results.length >0){
                    const {lat,lng} = locationResponse.results[0].geometry;
                    setLocation([lat, lng]); 
                }
            }

            catch(error){
                console.log(error)
            }
        };
        fetchCoordinates();
    }, [apartment, address, city, country])

    return (
        <MapContainer
            center={location}
            zoom={12}
            scrollWheelZoom={true}
            style={{
                marginTop: "2rem",
                height: "100%",
                width: "100%",
                borderRadius: "10px"
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            

            {/* To use useMap it can only be done inside a child component of the current div */}
            <GeoMarker position = {location} />
        </MapContainer>
    );
}
