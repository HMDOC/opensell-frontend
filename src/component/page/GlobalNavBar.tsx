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
                                <ProfilIcon src={props.customerDto?.customerInfo?.iconPath ? props.customerDto?.customerInfo?.iconPath : "data:image/jpeg;base64,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"} />
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