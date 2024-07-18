import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { IconButton, Stack, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function Home(): ReactElement {

    var search = "";
    const navigate = useNavigate();

    const getLink = (e): void => {
        e.preventDefault();
        navigate(`/catalog?query=${search}`);
    }
    return (
        <>
            <title>Opensell</title>
            <div className="splash-div">
                <div className="splash-text">
                    <Typography variant="h1" style={{ paddingRight: "180px" }}>OpenSell</Typography>
                    <div className="splash-middle">
                        <div className="splash-line"></div>
                        <Typography variant="h1">Inc.</Typography>
                    </div>
                </div>

                <p className="splash-bottom">The online marketplace, redesigned</p><br />
                <form onSubmit={getLink} className="inputContainer">
                    <Stack direction="row" alignItems="center">
                        <input onChange={(e) => { search = e.target.value }} type="text" placeholder="Search" className="mainMenuInput" />

                        <IconButton type="submit">
                            <SearchIcon />
                        </IconButton>
                    </Stack>
                </form>
            </div>
        </>
    );
}