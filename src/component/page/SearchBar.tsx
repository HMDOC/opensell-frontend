import { Component, ReactNode } from "react";

export default class SearchBar extends Component {
    public render(): ReactNode {
        return(
            <>
                <form action="" method="get">
                    <input placeholder="what are you looking for?" />
                    <button>Search</button>
                </form>
            </>
        );
    }

}