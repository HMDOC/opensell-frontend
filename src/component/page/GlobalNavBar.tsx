import { ReactElement, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";
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
            <Navbar expand="lg" className="mb-2 nav">
                <div className='nav-left'>
                    <Navbar.Brand><NavLink to="/" className="nav"><img src="./img/opensell-logo.svg" alt="Opensell logo" className="logo" /><h3>OpenSell Inc.</h3></NavLink></Navbar.Brand>
                </div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                <div className='nav-center'>
                        <Nav className="me-auto">
                            {navLinks.quickMenu.map((nav) =>
                            (
                                <NavLink className={b} to={nav.path}>{nav.label}</NavLink>
                            ))}

                        </Nav>
                </div>
                <div className='nav-right'>
                <NavDropdown title={<ProfilIcon src='http://dummyimage.com/124x100.png/ff4444/ffffff' />} id="basic-nav-dropdown">
                    <NavDropdown.Item>John Doe</NavDropdown.Item>
                    <NavDropdown.Divider />
                    {navLinks.dropdownMenu.map((nav) =>
                    (
                        <NavDropdown.Item><NavLink style={{ color: "black" }} className="dropdownItems" to={nav.path}>{nav.label}</NavLink></NavDropdown.Item>
                    ))}
                    <NavDropdown.Item>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </div>
            </Navbar.Collapse>
        </Navbar >
        </>
    );
}