import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Typography } from "@mui/material";
export default function Home(): ReactElement {

    var search = "";
    const navigate = useNavigate();

    const getLink = (e): void => {
        e.preventDefault();
        navigate(`/catalog?query=${search}`);
    }
    return (
        <>
            <title>Opensell</title>
            <div className="splash-div">
                <div className="splash-text">
                    <Typography variant="h1" style={{ paddingRight: "180px"}}>OpenSell</Typography>
                    <div className="splash-middle">
                        <div className="splash-line"></div>
                        <Typography variant="h1">Inc.</Typography>
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