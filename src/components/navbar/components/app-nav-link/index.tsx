import { NavLink } from "react-router-dom";

const MUI_CLASS_LINK = "MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover css-hop29v-MuiTypography-root-MuiLink-root";

export default function AppNavLink(props: { label: string, path: string }) {
    return (
        <NavLink style={{ color: "black" }} to={props.path} className={({ isActive }) => isActive ? "is-active " : "" + MUI_CLASS_LINK}>
            {props.label}
        </NavLink>
    );
}