import { ReactElement } from "react";
import "./style.css";
import SearchFilters from "../search-filters";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Stack } from "@mui/material";

/** 
    The component for the search bar.
    @author Davide
*/
const SearchBar = (props): ReactElement => {
    const searchBarPress = (event) => {
        let key: string = event.key;
        if (key === "Enter") {
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }

    return (
        <div className="catSearchBar">
            <Stack direction="row" alignItems="center" className="catInputContainer">
                <input className="catMainMenuInput" ref={props.reference} onKeyDown={searchBarPress} placeholder="Search" />

                <IconButton type="submit" form="searchFilters" className="catSearchButton" onClick={props.click}>
                    <SearchIcon />
                </IconButton>
            </Stack>

            <SearchFilters
                searchTags={props.searchTags}
                setSearchTags={props.setSearchTags}
                filterUpdate={props.filterUpdate}
                filterElementRef={props.filters}
                defValue={props.defSortValue}
            />
        </div>
    )
}

export default SearchBar;