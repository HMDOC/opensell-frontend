import { ReactElement, useState } from "react";
import "../../css/component/page/MainMenu.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function MainMenu(): ReactElement {
    var search = "";
    const navigate = useNavigate();

    const getLink = (e): void => {
        e.preventDefault();
        navigate(`/catalog?query=${search}`);
    }
    return (
        <>
            <div className="searchBar">
                <h1>Opensell Inc.</h1><br />
                <form onSubmit={getLink}>
                    <input onChange={(e) => {search = e.target.value}} type="text" placeholder="Search" className="mainMenuInput" />
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/>
                </form>
            </div>
        </>
    );
}