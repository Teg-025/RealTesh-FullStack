import React from "react";
import "./Button.css";

export default function Button(props){
    return(
        <button className="btn"
            style={{backgroundColor: props.backgroundColor}}
            disabled = {props.disabled}
        >
            {props.text}
        </button>
    )
}