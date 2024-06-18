import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
export default function MainMenu(): ReactElement {

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
                    <p style={{ paddingRight: "100px"}}>OpenSell</p>
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