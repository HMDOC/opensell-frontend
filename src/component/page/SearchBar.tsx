import { Component, ReactNode, ReactElement } from "react";
import "../../css/component/page/SearchBar.css";

const SearchBar = (props) : ReactElement => {

    const searchBarPress = (event) => {
        let key:string = event.key;
        if (key==="Enter"){
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }

    //const query = useRef();
    return (
        <div id="searchBar">
            <input ref={props.reference} onKeyDown={searchBarPress} placeholder="what are you looking for?" />
            <button onClick={props.click}>Search</button>
        </div>
    )
}

export default SearchBar;