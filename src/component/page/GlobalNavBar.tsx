import { ReactElement, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
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
export default function GlobalNavBar(props): ReactElement {
    const naviguate = useNavigate();
    const b = ({ isActive }) => {
        return isActive ? "is-active" : "center-items"
    };
    const logout = () => {
        props.logout();
        localStorage.removeItem('token');
        naviguate('/home');
    }

    return (
        <>
            <Navbar expand="lg" className="mb-2 nav">
                <div className='nav-left'>
                    <Navbar.Brand className='nav-title'><NavLink to="/home"><img src="/img/opensell-logo.png" alt="Opensell logo" className="brand-logo" /><h2>OpenSell Inc.</h2></NavLink></Navbar.Brand>
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
                        <NavDropdown.Item>{props.username}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item key={createRandomKey()} as={Link} to={props.link == undefined ? "/login" : `/user/${props.link}`}>My Profile</NavDropdown.Item>
                        {navLinks.dropdownMenu.map((nav) =>
                        (
                            <NavDropdown.Item key={createRandomKey()} as={Link} to={nav.path}>{nav.label}</NavDropdown.Item>
                        ))}
                        <NavDropdown.Divider />
                            {props.isLogged ? (
                                <NavDropdown.Item style={{fontSize : "20px", fontWeight : "5px"}} onClick={() => logout()}>
                                    Logout
                                </NavDropdown.Item>
                                ) : (
                                    <NavDropdown.Item style={{fontSize : "20px", fontWeight : "5px"}} onClick={() => naviguate('/login')}>
                                    Login
                                    </NavDropdown.Item>
                                    )}
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar >
        </>
    );
}