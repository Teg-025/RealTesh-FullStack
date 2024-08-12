import React from "react";
import "./CardService.css";

export default function CardService(props){

    const {img, head, desc, handleClick} = props;

    return(
        <div className="card">
            <img className="card-img" src={img} alt="alt" />
            <div className="card-head">{head}</div>
            <div className="card-desc">{desc}</div>
            <button className="btn" onClick={()=>{handleClick(head)}}>{props.buttonTxt}</button>
        </div>
    )
}
