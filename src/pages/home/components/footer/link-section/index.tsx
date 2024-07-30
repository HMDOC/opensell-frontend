import { Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

type LinkSectionProps = {
    title: string;
    links: { label: string, pathname: string }[];
};

export default function LinkSection(props: LinkSectionProps) {
    return (
        <Stack spacing={0.5}>
            <Typography variant="h5">{props.title}</Typography>

            <Stack>
                {props.links.map((link, index) => (
                    <MuiLink
                        variant="subtitle1"
                        color="text.primary"
                        underline="hover"
                        sx={{ textDecoration: "none" }}
                        component={Link}
                        to={link.pathname}
                        key={`${index}-${props.title}`}
                    >
                        {link.label}
                    </MuiLink>
                ))}
            </Stack>
        </Stack>
    );
}