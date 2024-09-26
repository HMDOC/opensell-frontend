import { DESKTOP_VIEW, MOBILE_VIEW } from "@context/AppContext";
import { Stack, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

export default function Logo({ isDesktop = false, isNotNavbar = false }) {
    const theme = useTheme();

    return (
        <Stack
            sx={{ textDecoration: "none" }}
            display={isNotNavbar ? undefined : (isDesktop ? DESKTOP_VIEW : MOBILE_VIEW)}
            direction="row"
            alignItems="center"
            spacing={0.2}
            useFlexGap
            component={Link}
            color={theme.palette.text.primary as any}
            to="/"
        >
            <img width={isNotNavbar ? "45px" : "34px"} src="/logo.png"></img>

            <Typography
                variant={isNotNavbar ? "h4" : "h5"}
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