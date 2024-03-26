import { ReactElement, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";
import Logo from "../page/opensell-logo.svg";
import { NavItem } from 'react-bootstrap';
import ProfilIcon from './ProfilIcon';

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
                                <NavLink className={b} to={nav.path}>{nav.label}</NavLink>
                            ))}

                        </Nav>
                            <NavDropdown title={<ProfilIcon src='http://dummyimage.com/124x100.png/ff4444/ffffff' />}id="basic-nav-dropdown">
                                <NavDropdown.Item>John Doe</NavDropdown.Item>
                                <NavDropdown.Divider />
                                {navLinks.dropdownMenu.map((nav) =>
                                (
                                    <NavDropdown.Item><NavLink className="dropdownItems" to={nav.path}>{nav.label}</NavLink></NavDropdown.Item>
                                ))}
                                <NavDropdown.Item>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                    </Navbar.Collapse>
            </Navbar>
        </>
    );
}