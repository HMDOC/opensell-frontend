import { ReactElement, useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../../css/component/page/GlobalNavBar.css";
import navLinks from "./Navbar.json";
import ProfilIcon from './ProfilIcon';
import { createRandomKey } from '../../services/RandomKeys';
import { CustomerDto } from '../../entities/dto/CustomerDto';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ApplicationContext } from '../../ApplicationContext';
import { Button } from 'react-bootstrap';

/**
 * 
 * @author Quoc 
 */
export default function GlobalNavBar(props: { logout(): void}): ReactElement {
    const naviguate = useNavigate();
    const {customerDto, setIsDarkMode, isDarkMode} = useContext(ApplicationContext);
    
    const b = ({ isActive }) => {
        return isActive ? "is-active" : ""
    };

    const logoutAction = () => {
        props.logout();
        localStorage.removeItem('token');
        naviguate('/');
    }

    return (
        <>
            <Container fluid>
                <Row className='nav'>
                    <Col className='nav-left'>
                        {navLinks.quickMenu.map((nav) =>
                        (
                            <NavLink key={createRandomKey()} className={b} to={nav.path}>{nav.label}</NavLink>
                        ))}
                        <Button onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? "dark" : "light"}</Button>
                    </Col>

                    <Col xs={12} md={12}>
                        <div className='nav-center'>
                            <NavLink to="/">
                                <img src="/img/opensell_logo.png" alt="Opensell logo" className="brand-logo" />
                            </NavLink>
                        </div>
                    </Col>

                    <Col>
                        {customerDto?.customerInfo ? (
                            <NavDropdown style={{marginTop : "-25px"}} className='nav-right' title={
                                <ProfilIcon src={customerDto?.customerInfo?.iconPath} />
                            } id='basic-nav-dropdown'>
                                <div className='dropdown-box'>
                                <NavDropdown.Item className='dropdown-username'>{customerDto?.link == undefined ? "Guest" : customerDto?.username}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                {navLinks.dropdownMenu.map((nav) =>
                                (
                                    <NavDropdown.Item key={createRandomKey()} as={Link} to={nav.path}>{nav.label}</NavDropdown.Item>
                                ))}
                                <NavDropdown.Divider />
                                
                                <NavDropdown.Item onClick={logoutAction}>Logout</NavDropdown.Item>
                                </div>
                            </NavDropdown>
                        ) : (

                            <div className='nav-right'>
                                <NavLink className="nav-button" to="/login">
                                    <div className='button1'>
                                        SIGN IN
                                    </div>
                                </NavLink>
                                <NavLink className="nav-button" to="/signup">
                                    <div className='button2'>
                                        GET STARTED
                                    </div>
                                </NavLink>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}