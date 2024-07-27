import { DESKTOP_VIEW, MOBILE_VIEW } from "@context/AppContext";
import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Logo({ isDesktop = false }) {
    return (
        <Stack sx={{ textDecoration: "none" }} display={isDesktop ? DESKTOP_VIEW : MOBILE_VIEW} direction="row" alignItems="center" spacing={0.2} useFlexGap component={Link} to="/">
            <img width="34px" src="/logo.png"></img>
            <Typography
                variant="h5"
                color="black"
                sx={{
                    fontWeight: "500",
                    fontFamily: 'Inter',
                    letterSpacing: '.025rem',
                }}
            >
                Opensell
            </Typography>
        </Stack>
    )
}