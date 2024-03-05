import { Component, ReactNode } from "react";
import "../../css/component/page/SearchBar.css";

export default class SearchBar extends Component {
    public render(): ReactNode {
        return(
            <div id="searchBar">
                <input placeholder="what are you looking for?" />
                <button>Search</button>
            </div>
        );
    }

}