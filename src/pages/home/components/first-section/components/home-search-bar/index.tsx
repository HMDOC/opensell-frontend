import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase } from "@mui/material";
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeSearchBar() {
    const navigate = useNavigate();

    const getLink = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        let query = new FormData(e.currentTarget).get("query") as string;
        navigate(`/catalog?query=${encodeURIComponent(query)}`);
    };

    return (
        <form
            onSubmit={getLink}
            style={{
                display: "flex",
                border: "2px solid rgba(255, 255, 255, 0.433)",
                width: "100%",
                padding: "7px",
                alignItems: "center",
                borderRadius: "20px"
            }}
        >
            <InputBase
                sx={{
                    color: "white",
                    width: "100%",
                    fontSize: "20px",
                    marginLeft: "13px"
                }}
                placeholder="Search"
                name="query"
            />

            <IconButton type="submit">
                <SearchIcon sx={{ color: "white" }} />
            </IconButton>
        </form>
    )
}