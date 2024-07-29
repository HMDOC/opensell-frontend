import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Stack, useTheme } from "@mui/material";
import "./style.css";

type HomeSearchBarProps = {
    click?: any;
    reference?: any;
    searchBarPress?: any;
    isSearch?: boolean;
};

export default function HomeSearchBar(props: HomeSearchBarProps) {
    const theme = useTheme();

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            className="inputContainer"
            sx={{
                border: "2px solid " + theme.palette.grey[700],
                height : props.isSearch ? "50px" : undefined,
                width: props.isSearch ? "280px" : "550px",
                padding: props.isSearch ? undefined : "7px",
            }}
        >
            {/* Need to try with InputBase */}
            <input
                style={{
                    color: theme.palette.text.primary,
                    height: props.isSearch ? undefined : "35px",
                    fontSize: props.isSearch ? undefined : "20px"
                }}
                className="mainMenuInput"
                ref={props.reference}
                onKeyDown={props.searchBarPress}
                placeholder="Search"
                name="query"
            />

            <IconButton type="submit" onClick={props.click}>
                <SearchIcon />
            </IconButton>
        </Stack>
    )
}