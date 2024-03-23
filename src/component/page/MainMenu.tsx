import { ReactElement } from "react";
import "../../css/component/page/MainMenu.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
export default function MainMenu() : ReactElement {
        return(
            <>
                <div className="searchBar">
                    <h1>Opensell Inc.</h1><br />
                    <input type="text" placeholder="Search" className="mainMenuInput"/>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
                </div>
            </>
        );
    }