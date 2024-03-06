import { Component, ReactNode, ReactElement } from "react";
import "../../css/component/page/SearchBar.css";

const SearchBar = (props) : ReactElement => {

    //const query = useRef();

    return (
        <div id="searchBar">
            <input placeholder="what are you looking for?" />
            <button>Search</button>
        </div>
    )
}

export default SearchBar;