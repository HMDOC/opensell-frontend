import React, { ChangeEvent, ReactElement, ReactNode, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";

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
            <Navbar expand="lg" className="bg-danger mb-2">
            <Navbar.Brand><NavLink to="/" style={{ textDecoration: "none", color: "black" }}><h2>OpenSell Inc.</h2></NavLink></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {navLinks.map((nav) =>
                            (
                                <Nav.Link><NavLink className={b} to={nav.path}>{nav.label}</NavLink></Nav.Link>
                            ))}

                            <NavDropdown title="AccountName" id="basic-nav-dropdown">
                                <NavDropdown.Item><Link className='navLinks' to="">My Profile</Link></NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link className='navLinks' to="">My Posts</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link className='navLinks' to="">Settings</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item>
                                    Placeholder
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Navbar.Collapse>
            </Navbar>
        </>
    );
}