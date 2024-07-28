import { FormEvent, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { IconButton, Stack, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { AboutLine } from "@pages/about";

export default function Home(): ReactElement {
    const navigate = useNavigate();

    const getLink = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        let query = new FormData(e.currentTarget).get("query") as string;
        navigate(`/catalog?query=${encodeURIComponent(query)}`);
    };

    return (
        <Stack sx={{ float: "left", marginTop: "10%", marginLeft: "10%" }}>
            <title>Opensell</title>
            <Stack>
                <Typography variant="h1" style={{ paddingRight: "180px" }}>Opensell</Typography>
                <Stack direction="row" alignItems="center" spacing={2} useFlexGap>
                    <AboutLine />
                    <Typography variant="h1">Inc.</Typography>
                </Stack>
            </Stack>

            <Typography variant="h5">The online marketplace redesigned.</Typography><br />

            <form onSubmit={getLink} className="inputContainer">
                <input name="query" placeholder="Search" className="mainMenuInput" />

                <IconButton type="submit">
                    <SearchIcon />
                </IconButton>
            </form>
        </Stack >
    );
}