import { Link, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AppNavLink(props: { label: string, path: string }) {
    const theme = useTheme();

    return (
        <Link variant="h5" color={theme.palette.text.primary as any} component={NavLink} to={props.path} underline="hover">
            {props.label}
        </Link>
    );
}