import { ReactElement, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";
import ProfilIcon from './ProfilIcon';
import { createRandomKey } from '../../services/RandomKeys';

/**
 * 
 * @author Quoc 
 */
export default function GlobalNavBar(): ReactElement {
    const b = ({ isActive }) => {
        return isActive ? "is-active" : "center-items"
    };

    return (
        <>
            <Navbar expand="lg" className="mb-2 nav">
                <div className='nav-left'>
                    <Navbar.Brand className='nav-title'><NavLink to="/"><img src="./img/opensell-logo.png" alt="Opensell logo" className="brand-logo" /><h2>OpenSell Inc.</h2></NavLink></Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {navLinks.quickMenu.map((nav) =>
                        (
                            <NavLink key={createRandomKey()} className={b} to={nav.path}>{nav.label}</NavLink>
                        ))}
                    </Nav>
                    <NavDropdown title={<ProfilIcon src='http://dummyimage.com/124x100.png/ff4444/ffffff' />} id='basic-nav-dropdown'>
                        <NavDropdown.Item>John Doe</NavDropdown.Item>
                        <NavDropdown.Divider />
                        {navLinks.dropdownMenu.map((nav) =>
                        (
                            <NavDropdown.Item key={createRandomKey()} as={Link} to={nav.path}>{nav.label}</NavDropdown.Item>
                        ))}
                        <NavDropdown.Item>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar >
        </>
    );
}