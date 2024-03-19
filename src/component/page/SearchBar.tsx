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
        filterRef.current.hidden = !filterRef.current.hidden;
    }

    return (
        <div id="filter">
            <button onClick={toggleFilters}>F</button>
        </div>
    )
}

/** 
    The component for the search bar.
    @author Davide
*/
const SearchBar = (props) : ReactElement => {

    const filterElementRef = useRef<HTMLDivElement>();

    const searchBarPress = (event) => {
        let key:string = event.key;
        if (key==="Enter"){
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }


    return (
        <>
            <div id="searchBar">
                <input ref={props.reference} onKeyDown={searchBarPress} placeholder="what are you looking for?" />
                <FilterToggle filterRef={filterElementRef} />
                <button onClick={props.click}>Search</button>
            </div>
            <SearchFilters filterElementRef={filterElementRef} />
        </>
        
    )
}

export default SearchBar;