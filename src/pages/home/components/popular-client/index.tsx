import AbcIcon from '@mui/icons-material/Abc';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BackpackIcon from '@mui/icons-material/Backpack';
import BarChartIcon from '@mui/icons-material/BarChart';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import CameraIcon from '@mui/icons-material/Camera';
import DiamondIcon from '@mui/icons-material/Diamond';
import PinIcon from '@mui/icons-material/Pin';
import { Stack, Typography } from "@mui/material";
import { ReactElement } from "react";

const ICON_PROPS = {
    fontSize: "100px"
}

export default function PopularClient(): ReactElement {
    return (
        <Stack alignItems="center" padding={5} gap={2}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">Used by the world's best buyers and sellers</Typography>

            <Stack direction="row" justifyContent="center" gap={5} flexWrap="wrap">
                <DiamondIcon sx={ICON_PROPS} />
                <BlurOnIcon sx={ICON_PROPS} />
                <PinIcon sx={ICON_PROPS} />
                <AbcIcon sx={ICON_PROPS} />
                <AccountTreeIcon sx={ICON_PROPS} />
                <CameraIcon sx={ICON_PROPS} />
                <BackpackIcon sx={ICON_PROPS} />
                <BarChartIcon sx={ICON_PROPS} />
            </Stack>
        </Stack>
    );
}