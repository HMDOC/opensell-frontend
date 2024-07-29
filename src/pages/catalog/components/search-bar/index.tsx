import SearchIcon from '@mui/icons-material/Search';
import { Card, IconButton, InputBase, Stack, useTheme } from "@mui/material";
import { ReactElement } from "react";
import SearchFilters from "../search-filters";
import "./style.css";

type SearchBarProps = {

};

/** 
    The component for the search bar.
    @author Davide
*/
export default function SearchBar(props: any): ReactElement {
    const theme = useTheme();

    const searchBarPress = (event: any) => {
        let key: string = event.key;
        if (key === "Enter") {
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }

    return (
        <Card component={Stack} width="350px" padding={2}>
            <Stack border={1} direction="row" alignItems="center" className="catInputContainer">
                {/* Need to try with InputBase */}
                <input style={{ color: theme.palette.text.primary }} className="catMainMenuInput" ref={props.reference} onKeyDown={searchBarPress} placeholder="Search" />

                <IconButton type="submit" form="searchFilters" onClick={props.click}>
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
        </Card>
    )
}