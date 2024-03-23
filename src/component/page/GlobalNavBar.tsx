import { ReactElement } from 'react';
import { Link, NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";
import Logo from "../page/opensell-logo.svg";
/**
 * 
 * @author Quoc 
 */
export default function GlobalNavBar(): ReactElement {
    const b = ({ isActive }) => {
        return isActive ? "is-active" : "nav"
    };

    return (
        <>
            <Navbar expand="lg" className="mb-2 nav" style={{backgroundColor : "#133071"}}>
            <Navbar.Brand><NavLink to="/" className="nav"><img src={Logo} alt="Opensell logo" className="logo" /><h3>OpenSell Inc.</h3></NavLink></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {navLinks.quickMenu.map((nav) =>
                            (
                                <Nav.Link><NavLink className={b} to={nav.path}>{nav.label}</NavLink></Nav.Link>
                            ))}

                            <NavDropdown title="AccountName" id="basic-nav-dropdown">
                                {navLinks.dropdownMenu.map((nav) =>
                                (
                                    <NavDropdown.Item><Link className='navLinks' to={nav.path}>{nav.label}</Link></NavDropdown.Item>
                                ))}

                                <NavDropdown.Divider />

                                <NavDropdown.Item>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Navbar.Collapse>
            </Navbar>
        </>
    );
}