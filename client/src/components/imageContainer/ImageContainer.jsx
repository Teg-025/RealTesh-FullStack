import React from "react";
import {motion} from 'framer-motion'
import "./ImageContainer.css"


export default function ImageContainer(props){
    return(
        <motion.div 
            initial = {{x:"2rem", opacity:0}}
            animate = {{x: 0, opacity: 1}}
            transition={{
                duration: 2, type: "ease-in"
            }}
            className = "window-img-container"
        >
            <img src={props.image} alt={props.alt} />
        </motion.div> 
    )
}