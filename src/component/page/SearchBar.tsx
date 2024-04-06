import { Component, ReactNode, ReactElement, useRef, ChangeEvent } from "react";
import "../../css/component/page/SearchBar.css";
import SearchFilters from "./SearchFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

/** 
    The component for the search bar.
    @author Davide
*/
const SearchBar = (props) : ReactElement => {

    const searchBarPress = (event) => {
        let key:string = event.key;
        if (key==="Enter"){
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }


    return (
        <div className="catSearchBar">
            <div className="catInputContainer">
                <div>
                    <input className="catMainMenuInput" ref={props.reference} onKeyDown={searchBarPress} placeholder="Search" />
                    <button className="catSearchButton" onClick={props.click}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/>
                    </button>
                </div>
                <SearchFilters searchTags={props.searchTags} setSearchTags={props.setSearchTags} filterUpdate={props.filterUpdate} filterElementRef={props.filters} />
            </div>
        </div>
        
    )
}

export default SearchBar;