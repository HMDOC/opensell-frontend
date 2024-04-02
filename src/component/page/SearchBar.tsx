import { Component, ReactNode, ReactElement, useRef } from "react";
import "../../css/component/page/SearchBar.css";
import SearchFilters from "./SearchFilters";

/** 
    The component for the filter.
    @author Davide
*/
const FilterToggle = (props) : ReactElement => {
    
    const filterRef = props.filterRef;

    const toggleFilters = () => {
        filterRef.current.parentElement.hidden = !filterRef.current.parentElement.hidden;
    }

    return (
        <div id="filter" style={{display : 'inline'}}>
            <button onClick={toggleFilters}>F</button>
        </div>
    )
}

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
                <input className="catMainMenuInput" ref={props.reference} onKeyDown={searchBarPress} placeholder="What are you looking for?" />
                <FilterToggle filterRef={props.filters} />
                <button style={{marginTop: "50%"}} onClick={props.click}>Search</button>
            </div>
            <SearchFilters filterUpdate={props.filterUpdate} filterElementRef={props.filters} />
        </div>
        
    )
}

export default SearchBar;