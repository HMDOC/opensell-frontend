import { ReactElement } from 'react';
import { Dropdown, DropdownItem, FormCheck } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from '../../context/AppContext';
import { ThemeOption } from '../../context/Theme';
import { createRandomKey } from '../../services/RandomKeys';
import ProfilIcon from '../shared/ProfilIcon';
import navLinks from "./links.json";
import "./style.css";

/**
 * 
 * @author Quoc 
 */
export default function Navbar(props: { logout(): void }): ReactElement {
    const naviguate = useNavigate();
    const { customerDto, changeTheme, theme, isDarkMode } = useAppContext();

    const b = ({ isActive }) => {
        return isActive ? "is-active" : ""
    };

    const logoutAction = () => {
        props.logout();
        localStorage.removeItem('token');
        naviguate('/');
    }

    const CheckBox = (props: { label: string, theme: ThemeOption }) => {
        return (
            <FormCheck
                defaultChecked={props.theme === theme}
                name="theme-option"
                type="radio"
                label={props.label}
                onClick={() => changeTheme(props.theme)} />
        )
    }

    return (
        <>
            <Container fluid>
                <Row className='nav'>
                    <Col className='nav-left'>
                        <Dropdown>
                            <Dropdown.Toggle className="display-dropdown-color">Theme</Dropdown.Toggle>
                            <Dropdown.Menu variant="light">
                                <DropdownItem as={CheckBox} label="dark" theme={ThemeOption.DARK} />
                                <DropdownItem as={CheckBox} label="light" theme={ThemeOption.LIGHT} />
                                <DropdownItem as={CheckBox} label="browser theme" theme={ThemeOption.BROWSER_DEFAULT} />
                            </Dropdown.Menu>
                        </Dropdown>

                        {navLinks.quickMenu.map((nav) =>
                        (
                            <NavLink key={createRandomKey()} className={b} to={nav.path}>{nav.label}</NavLink>
                        ))}
                    </Col>

                    <Col xs={12} md={12}>
                        <div className='nav-center'>
                            <NavLink to="/">
                                <img src={`/img/${isDarkMode() ? "dark" : "light"}-logo.svg`} alt="Opensell logo" className="brand-logo" />
                            </NavLink>
                        </div>
                    </Col>

                    <Col>
                        {customerDto?.customerInfo ? (
                            <NavDropdown style={{ marginTop: "-25px" }} className='nav-right' title={
                                <ProfilIcon src={customerDto?.customerInfo?.iconPath} username={customerDto?.username} />
                            } id='basic-nav-dropdown'>
                                <div className='dropdown-box'>
                                    <NavDropdown.Item className='dropdown-username'>{customerDto?.link === undefined ? "Guest" : customerDto?.username}</NavDropdown.Item>
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