import React from 'react';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

/**
 * 
 * @author Quoc 
 */


export default function GlobalNavBar() {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand><Link to="/">OpenSell Inc.</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link><Link to="/">Home</Link></Nav.Link>

                            <Nav.Link><Link to="/catalog">Catalog</Link></Nav.Link>

                            <Nav.Link><Link to="/login">Login</Link></Nav.Link>

                            <Nav.Link><Link to="/signup">Register</Link></Nav.Link>

                            <NavDropdown title="AccountName" id="basic-nav-dropdown">
                                <NavDropdown.Item><Link to="">My Profile</Link></NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link to="">My Posts</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link to="">Settings</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item>
                                    Placeholder
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}