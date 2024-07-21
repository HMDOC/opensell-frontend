import { NavLink } from "react-router-dom";

export default function AppNavLink(props: { label: string, path: string }) {
    return (
        <NavLink to={props.path} className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
            {props.label}
        </NavLink>
    );
}