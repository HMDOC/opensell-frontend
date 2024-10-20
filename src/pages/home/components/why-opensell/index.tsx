import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import GroupsIcon from '@mui/icons-material/Groups';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stack, Typography } from "@mui/material";
import { ReactElement } from "react";
import WhySection from './components/why-section';

export default function WhyOpensell(): ReactElement {
    return (
        <Stack alignItems="center" spacing={3} padding={5}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">Why people choose Opensell?</Typography>

            <Stack direction="row" justifyContent="center" gap={8} maxWidth="1300px" flexWrap="wrap">
                <WhySection icon={GroupsIcon} text="A large community of buyers and sellers." />
                <WhySection icon={SearchIcon} text="A fast and powerful search engine." />
                <WhySection icon={ImageOutlinedIcon} text="Support for JPEG, PNG, WEBP and more." />

                <WhySection icon={GridViewIcon} text="Modern user interface designed for ease of use." />
                <WhySection icon={DarkModeOutlinedIcon} text="Supports dark and light modes for a more immersive experience." />
                <WhySection icon={SettingsIcon} text="Many options to customize the site the way you want." />
            </Stack>
        </Stack>
    );
}