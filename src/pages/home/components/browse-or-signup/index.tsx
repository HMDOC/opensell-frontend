import { DESKTOP_VIEW } from "@context/AppContext";
import { Stack, Typography } from "@mui/material";
import ActionButton from "./components";

export default function BrowseOrSignup() {
    return (
        <Stack padding={5} bgcolor="#476282" color="white" justifyContent="center" alignItems="center" spacing={7} direction="row" height="500px">
            <Stack spacing={2}>
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