import React from "react";
import "./Footer.css"
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer(props){
    return(
        <div className="footer" >
            <div className="left-footer-section">
                <img src="/footer_logo_edit.png" alt="logo" width={200} />
                <div className="footer-tagline">Our goal is to assist you in finding your dream home, one detail at a time.</div>
            </div>
            <div className="right-footer-section">
                <div className="contact-footer">
                    <div className="head">Contact us</div>
                    <div className="mobile"><CallIcon />&nbsp;+91 8447179444</div>
                    <div className="email"><EmailIcon />&nbsp;tegesh.8124@gmail.com</div>
                </div>
            </div>
        </div>
    )
}