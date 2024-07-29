import { MuiMenu, MuiMenuItem } from '@components/shared/mui-menu';
import { DESKTOP_VIEW, MOBILE_VIEW, useAppContext } from '@context/AppContext';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from '@mui/icons-material/Settings';
import WebIcon from '@mui/icons-material/Web';
import { Divider, Fade, IconButton, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createRandomKey } from '@utils/RandomKeys';
import { ReactElement, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppNavLink from './components/app-nav-link';
import Logo from './components/logo';
import links from "./links.json";
import "./style.css";

/**
 * 
 * @author Quoc
 * @modifiedBy Achraf
 */
export default function Navbar(): ReactElement {
    const navigate = useNavigate();
    const [isMenuDisplayed, setIsMenuDisplayed] = useState(false);
    const { customerDto, logout } = useAppContext();

    const DROPDOWN_MENU = [
        {
            path: `/user/${customerDto?.username}`,
            label: "My profil",
            icon: <PersonIcon />
        },
        {
            path: "/u/my-ads",
            label: "My Ads",
            icon: <WebIcon />
        },
        {
            path: "/u/setting",
            label: "Settings",
            icon: <SettingsIcon />
        }
    ];

    const logoutAction = () => {
        logout();
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <AppBar position="static" enableColorOnDark color="transparent">
            <Container maxWidth={false}>
                <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* <ThemeToggle /> */}

                    {/* MOBILE SECTION */}
                    <Stack display={MOBILE_VIEW} direction="row" alignItems="center">
                        <IconButton onClick={() => setIsMenuDisplayed(!isMenuDisplayed)}>
                            <MenuIcon color='inherit' />
                        </IconButton>

                    </Stack>
                    <Logo />

                    {/* DESKTOP SECTION */}
                    <Stack alignItems="center" direction="row" spacing={5} sx={{ display: DESKTOP_VIEW }}>
                        <Logo isDesktop />

                        {links.navbar?.map((link) => (
                            <AppNavLink key={link.label} {...link} />
                        ))}
                    </Stack>

                    {/* COMMON SECTION */}
                    {customerDto ?
                        (
                            <MuiMenu menuIcon={
                                <Avatar src={customerDto?.iconPath}>
                                    {customerDto?.iconPath ? null : customerDto?.username?.at(0)}
                                </Avatar>
                            }>
                                <Stack component={MenuItem}>
                                    <Typography textAlign="center" variant="h6">{customerDto?.username ?? "Guest"}</Typography>
                                </Stack>
                                <Divider />

                                {DROPDOWN_MENU.map(item => (
                                    <MuiMenuItem
                                        {...item}
                                        key={createRandomKey()}
                                        action={() => navigate(item.path)}
                                    />
                                ))}
                                <Divider />

                                <MuiMenuItem
                                    icon={<LogoutIcon />}
                                    action={logoutAction}
                                    label="Logout"
                                />
                            </MuiMenu>
                        ) : (
                            <Stack direction="row" spacing={1.5}>
                                <NavLink className="nav-button sign-in" to="/login">SIGN IN</NavLink>
                                <NavLink className="nav-button get-started" to="/signup">GET STARTED</NavLink>
                            </Stack>
                        )
                    }
                </Toolbar>

                <Fade
                    in={isMenuDisplayed}
                    unmountOnExit
                >
                    <Stack sx={{
                        display: MOBILE_VIEW
                    }} justifyContent="center" alignItems="center">
                        {links.navbar.map((link) => (
                            <AppNavLink key={createRandomKey()} {...link} />
                        ))}
                    </Stack>
                </Fade>
            </Container>
        </AppBar>
    );
}