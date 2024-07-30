import { Stack, Typography } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

export default function WhySection(props: { icon: typeof SvgIcon, text: string }) {
    return (
        <Stack width="300px" justifyContent="center">
            <props.icon sx={{ fontSize: "70px", color: "#778DA9" }} />
            <Typography fontSize="20px">{props.text}</Typography>
        </Stack>
    );
}