import { ReactElement, useState } from "react";
import "../../css/component/page/MainMenu.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import getUserInfos from "../../services/GetUser";
import { CustomerInfoView } from "../../entities/dto/CustomerInfo";
export default function MainMenu(): ReactElement {

    var search = "";
    const navigate = useNavigate();

    const getLink = (e): void => {
        e.preventDefault();
        navigate(`/catalog?query=${search}`);
    }
    return (
        <div className="main-background">
            <div className="searchBar">
                <h1 id="mainTitle">OPENSELL INC.</h1><br />
                <form onSubmit={getLink} className="inputContainer">
                    <input onChange={(e) => {search = e.target.value}} type="text" placeholder="Search" className="mainMenuInput" />
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/>
                </form>
            </div>
        </div>
    );
}