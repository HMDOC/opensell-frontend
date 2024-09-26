import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase, Stack, useTheme } from "@mui/material";
import { FieldProps } from 'formik';
import "./style.css";

export default function CatalogSearchBar(props: FieldProps) {
    const theme = useTheme();

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            className="inputContainer"
            sx={{
                border: "2px solid " + theme.palette.grey[700],
                height: "50px",
                width: "240px",
            }}
        >
            <InputBase
                className="mainMenuInput"
                placeholder="Search"
                {...props.field}
            />

            <IconButton type='submit' >
                <SearchIcon />
            </IconButton>
        </Stack>
    )
}