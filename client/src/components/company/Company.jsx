import React from "react";
import "./Company.css"

export default function Company(props){
    return(
        <div className="company-img-container">
            <img className="company" src={props.img} alt='company'/>
        </div>
    )
}