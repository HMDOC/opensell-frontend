import { DESKTOP_VIEW } from "@context/AppContext";
import { Button, Stack, Typography } from "@mui/material";
import { ReactElement } from "react";
import { Link } from "react-router-dom";

function ActionButton(props: { label: string, pathname: string }) {
    return (
        <Link to={props.pathname}><Button sx={{ bgcolor: "#5F738B", color: "white" }}>{props.label}</Button></Link>
    );
}

export default function BrowseOrSignup(): ReactElement {
    return (
        <Stack padding={5} bgcolor="#476282" color="white" justifyContent="center" alignItems="center" spacing={7} direction="row" height="500px">
            <Stack spacing={1}>
                <Typography variant="h3">Deal like you have never seen</Typography>
                <Typography variant="h6">Start browsing for free or sign up for more features.</Typography>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <ActionButton label="Browse" pathname="/catalog?query=" />
                    <Typography variant="h6">or</Typography>
                    <ActionButton label="Sign up" pathname="/signup" />
                </Stack>
            </Stack>

            <Stack display={DESKTOP_VIEW} height="100%">
                <img style={{ width: "100%", height: "100%" }} src="/img/save.svg" />
            </Stack>
        </Stack>
    );
}