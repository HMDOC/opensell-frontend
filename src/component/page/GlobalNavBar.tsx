import { ReactElement, useState } from 'react';
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

/**
 * 
 * @author Quoc 
 */
export default function GlobalNavBar(props: { customerDto: CustomerDto, logout(): void}): ReactElement {
    const naviguate = useNavigate();
    const b = ({ isActive }) => {
        return isActive ? "is-active" : ""
    };
    const logout = () => {
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

                    </Col>

                    <Col xs={12} md={12}>
                        <div className='nav-center'>
                            <NavLink to="/">
                                <img src="/img/opensell_logo.png" alt="Opensell logo" className="brand-logo" />
                            </NavLink>
                        </div>
                    </Col>

                    <Col>
                        {props.customerDto?.customerInfo ? (
                            <NavDropdown style={{marginTop : "-25px"}} className='nav-right' title={
                                <ProfilIcon src={props.customerDto?.customerInfo?.iconPath ? props.customerDto?.customerInfo?.iconPath : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"} />
                            } id='basic-nav-dropdown'>
                                <div className='dropdown-box'>
                                <NavDropdown.Item className='dropdown-username'>{props.customerDto?.link == undefined ? "Guest" : props.customerDto?.username}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                {navLinks.dropdownMenu.map((nav) =>
                                (
                                    <NavDropdown.Item key={createRandomKey()} as={Link} to={nav.path}>{nav.label}</NavDropdown.Item>
                                ))}
                                <NavDropdown.Divider />
                                {props.customerDto ? (
                                    <NavDropdown.Item onClick={() => logout()}>
                                        Log out
                                    </NavDropdown.Item>
                                ) : (
                                    <NavDropdown.Item onClick={() => naviguate('/login')}>
                                        Login
                                    </NavDropdown.Item>
                                )}
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