import { Stack, Typography } from "@mui/material";
import { ReactElement } from "react";
import StatisticCard from "./components/statistic-card";

export default function Statistics(): ReactElement {
    return (
        <Stack bgcolor="#415A77" width="100%" alignItems="center" spacing={2} minHeight="350px" justifyContent="center" padding={5}>
            <Typography variant="h4" fontWeight="bold" color="white" textAlign="center">The place where everyone wins</Typography>

            <Stack direction="row" flexWrap="wrap" spacing={2} useFlexGap justifyContent="center">
                <StatisticCard value="10 000+" text="ad sold" />
                <StatisticCard value="5 000+" text="active users" />
                <StatisticCard value="car" text="is the most created category of ad" />
                <StatisticCard value="300 000+" text="ad posted" />
            </Stack>
        </Stack>
    );
}