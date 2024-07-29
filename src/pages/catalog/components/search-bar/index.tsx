import HomeSearchBar from '@components/shared/home-search-bar';
import { Card, Stack } from "@mui/material";
import { ReactElement } from "react";
import SearchFilters from "../search-filters";

type SearchBarProps = {

};

/** 
    The component for the search bar.
    @author Davide
*/
export default function SearchBar(props: any): ReactElement {

    const searchBarPress = (event: any) => {
        let key: string = event.key;
        if (key === "Enter") {
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }

    return (
        <Card component={Stack} width="350px" padding={2} spacing={3}>
            <Stack alignItems="center">
                <HomeSearchBar isSearch {...props} searchBarPress={searchBarPress} />
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