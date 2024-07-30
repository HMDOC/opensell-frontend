import { DESKTOP_VIEW } from "@context/AppContext";
import { Stack, Typography } from "@mui/material";
import { ReactElement } from "react";
import HomeSearchBar from "./components/home-search-bar";

export default function FirstSection(): ReactElement {

    return (
        <Stack color="white" bgcolor="#415A77" width="100%" justifyContent="center" height="700px" direction="row">
            <Stack maxWidth="800px" padding={10} justifyContent="center" gap={2.5}>
                <Typography variant="h2">Search and post ad with confidence</Typography>
                <Typography variant="h5">The online marketplace redesigned.</Typography>
                <HomeSearchBar />
            </Stack>

            <Stack display={DESKTOP_VIEW}>
                <img
                    style={{ height: "100%", objectFit: "cover", width: "100%" }}
                    src="/img/sell-car.jpg" />
            </Stack>
        </Stack>
    );
}