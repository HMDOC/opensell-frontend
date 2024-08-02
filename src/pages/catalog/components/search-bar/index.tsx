import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Stack, useTheme } from "@mui/material";
import "./style.css";
import { RefObject } from 'react';

type HomeSearchBarProps = {
    reference?: RefObject<HTMLInputElement>;
};

export default function CatalogSearchBar(props: HomeSearchBarProps) {
    const theme = useTheme();

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            className="inputContainer"
            sx={{
                border: "2px solid " + theme.palette.grey[700],
                height : "50px",
                width: "240px",
            }}
        >
            {/* Need to try with InputBase */}
            <input
                style={{
                    color: theme.palette.text.primary,
                }}
                className="mainMenuInput"
                ref={props.reference}
                placeholder="Search"
                name="query"
            />

            <IconButton type='submit' >
                <SearchIcon />
            </IconButton>
        </Stack>
    )
}