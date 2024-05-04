import { ReactElement, useState } from "react";
import "../../css/component/page/MainMenu.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import getUserInfos from "../../services/GetUser";
import { CustomerInfo } from "../../entities/dto/CustomerInfo";
export default function MainMenu(): ReactElement {

    var search = "";
    const navigate = useNavigate();

    const getLink = (e): void => {
        e.preventDefault();
        navigate(`/catalog?query=${search}`);
    }
    return (
        <>
            <div className="splash-div">
                <div className="splash-text">
                    <p style={{ paddingRight: "100px" }}>OpenSell</p>
                    <div className="splash-middle">
                        <div className="splash-line"></div>
                        <p>Inc.</p>
                    </div>
                </div>
                <p className="splash-bottom">The online marketplace, redesigned</p><br />
                <form onSubmit={getLink} className="inputContainer">
                    <input onChange={(e) => { search = e.target.value }} type="text" placeholder="Search" className="mainMenuInput" />
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
                </form>
            </div>
        </>
    );
}