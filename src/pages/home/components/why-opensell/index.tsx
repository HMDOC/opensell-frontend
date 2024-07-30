import { Stack, Typography } from "@mui/material";
import { ReactElement, ReactNode } from "react";
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import GridViewIcon from '@mui/icons-material/GridView';

function WhySection(props: { icon: ReactNode, text: string }) {
    return (
        <Stack width="300px" justifyContent="center">
            {props.icon}
            <Typography fontSize="20px">{props.text}</Typography>
        </Stack>
    );
}

const ICON_SIZE = {
    fontSize: "70px",
    color: "#415A77"
};

export default function WhyOpensell(): ReactElement {
    return (
        <Stack alignItems="center" spacing={3} padding={5}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">Why people choose Opensell</Typography>

            <Stack direction="row" justifyContent="center" gap={8} maxWidth="1300px" flexWrap="wrap">
                <WhySection icon={<GroupsIcon sx={ICON_SIZE} />} text="Great and large community of buyers and sellers." />
                <WhySection icon={<SearchIcon sx={ICON_SIZE} />} text="Fast and powerful search engine powered by Spring Boot." />
                <WhySection icon={<ImageOutlinedIcon sx={ICON_SIZE} />} text="Support for all types of images to help promote your ad." />

                <WhySection icon={<GridViewIcon sx={ICON_SIZE} />} text="Modern user interface for ease of use." />
                <WhySection icon={<DarkModeOutlinedIcon sx={ICON_SIZE} />} text="Support for both dark and light modes for a more immersive experience." />
                <WhySection icon={<SettingsIcon sx={ICON_SIZE} />} text="Lots of options to customize the site the way you want." />
            </Stack>
        </Stack>
    );
}