import { ReactElement, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";
import ProfilIcon from './ProfilIcon';
import { createRandomKey } from '../../services/RandomKeys';
import { CustomerDto } from '../../entities/dto/CustomerDto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

/**
 * 
 * @author Quoc 
 */
export default function GlobalNavBar(props: {customerDto: CustomerDto, logout(): void}): ReactElement {
    const naviguate = useNavigate();
    const b = ({ isActive }) => {
        return isActive ? "is-active" : "center-items"
    };

    const logout = () => {
        props.logout();
        localStorage.removeItem('token');
        naviguate('/');
    }

    return (
        <>
            <Navbar expand="lg" className="mb-2 nav">
                <div className='nav-left'>
                    <Navbar.Brand className='nav-title'>
                        <NavLink to="/">
                            <img src="/img/opensell-logo.png" alt="Opensell logo" className="brand-logo" />
                            <h2>OpenSell Inc.</h2>
                            </NavLink>
                    </Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {navLinks.quickMenu.map((nav) =>
                        (
                            <NavLink key={createRandomKey()} className={b} to={nav.path}>{nav.label}</NavLink>
                        ))}
                    </Nav>
                    <NavDropdown title={
                        props.customerDto?.customerInfo?.iconPath ?
                            (
                                <ProfilIcon src={props.customerDto?.customerInfo?.iconPath} />
                            ) : (
                                <FontAwesomeIcon size="2x" icon={faUser} />
                            )
                    } id='basic-nav-dropdown'>
                        <NavDropdown.Item>{props.customerDto?.link == undefined ? "Guest" : props.customerDto?.username}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item key={createRandomKey()} as={Link} to={props.customerDto?.link == undefined ? "/login" : `/user/${props.customerDto?.link}`}>My Profile</NavDropdown.Item>
                        {navLinks.dropdownMenu.map((nav) =>
                        (
                            <NavDropdown.Item key={createRandomKey()} as={Link} to={nav.path}>{nav.label}</NavDropdown.Item>
                        ))}
                        <NavDropdown.Divider />
                            {props.customerDto ? (
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