import { ReactElement } from "react";
import "./style.css";
import SearchFilters from "../search-filters";
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
            </div>
            <SearchFilters searchTags={props.searchTags} 
                setSearchTags={props.setSearchTags} 
                filterUpdate={props.filterUpdate} 
                filterElementRef={props.filters} 
                reverseSort={props.reverseSort} 
                defValue={props.defSortValue} />
        </div>
        
    )
}

export default SearchBar;