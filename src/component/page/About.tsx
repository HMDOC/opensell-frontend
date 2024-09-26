import { ReactElement, useState } from "react";
import "../../css/component/page/About.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function About(): ReactElement {
    return (
        <div className="main-background">
        <title>About Opensell</title>
            <div className="about-div">
                <div className="about-text">
                    <div className="top-about">
                        <p style={{ paddingRight: "100px" }}>About</p>
                        <div className="top-about-line"></div>
                    </div>
                    <div className="about-middle">
                        <div className="about-line"></div>
                        <p>Us</p>
                    </div>
                </div>
                <p className="about-bottom">
                    Ce site web a été réalisé par<span style={{fontWeight : "bold"}}> Quoc Dung</span>, <span style={{fontWeight : "bold"}}>Achraf</span>, <span style={{fontWeight : "bold"}}>Davide</span> et <span style={{fontWeight : "bold"}}>Olivier </span> dans le cadre du cours de développement web de janvier 2024 à mai 2024 au <span style={{fontWeight : "bold"}}>Cégep Marie-Victorin</span>.<br />
                    <br />
                </p><br />
            </div>
        </div>
    );
}