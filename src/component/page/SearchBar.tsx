import { Component, ReactNode, ReactElement } from "react";
import "../../css/component/page/SearchBar.css";

const SearchBar = (props) : ReactElement => {

    //const query = useRef();
    console.log("ts");
    console.log(props)
    return (
        <div id="searchBar">
            <input ref={props.reference} placeholder="what are you looking for?" />
            <button onClick={props.click}>Search</button>
        </div>
    )
}

export default SearchBar;