import React, { useState, useEffect } from "react";
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function GeoMarker(props){

    const position = props.position;
    const map = useMap()

    useEffect(()=>{
        map.flyTo(position, 14)
    }, [position, map])

    const defaultMarkerIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    return(
        <Marker position={position} icon={defaultMarkerIcon}>
                <Popup>
                    {position[0]},  {position[1]}
                </Popup>
        </Marker>
    )
}