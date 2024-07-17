import { MuiMenu, MuiMenuItem } from '@components/shared/mui-menu';
import { useAppContext } from '@context/AppContext';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from '@mui/icons-material/Settings';
import WebIcon from '@mui/icons-material/Web';
import { Divider, IconButton, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createRandomKey } from '@services/RandomKeys';
import { ReactElement, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppNavLink from './components/app-nav-link';
import links from "./links.json";
import "./style.css";
import ThemeToggle from './components/theme-toggle';

const DESKTOP_VIEW = { xs: 'none', md: 'flex' };
const MOBILE_VIEW = { xs: 'flex', md: 'none' };

const DROPDOWN_MENU = [
    {
        path: "/u/my-profil",
        label: "My profil",
        icon: <PersonIcon />
    },
    {
        path: "/u/my-ads",
        label: "My Ads",
        icon: <WebIcon />
    },
    {
        path: "/u/customer-modification",
        label: "Settings",
        icon: <SettingsIcon />
    }
];

/**
 * 
 * @author Quoc
 * @modifiedBy Achraf
 */
export default function Navbar(props: { logout(): void }): ReactElement {
    const navigate = useNavigate();
    const [isMenuDisplayed, setIsMenuDisplayed] = useState(false);
    const { customerDto } = useAppContext();

    const logoutAction = () => {
        props.logout();
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <AppBar position="static" enableColorOnDark>
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <ThemeToggle />

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: DESKTOP_VIEW,
                            fontFamily: "monospace",
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Opensell
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: MOBILE_VIEW }}>
                        <IconButton onClick={() => setIsMenuDisplayed(!isMenuDisplayed)}>
                            <MenuIcon color='inherit' />
                        </IconButton>
                    </Box>

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            display: MOBILE_VIEW,
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Opensell
                    </Typography>
                    <Stack direction="row" spacing={5} sx={{ flexGrow: 1, display: DESKTOP_VIEW }}>
                        {links.navbar?.map((link) => (
                            <AppNavLink {...link} />
                        ))}
                    </Stack>

                    {customerDto ?
                        (
                            <MuiMenu menuIcon={
                                <Avatar src={customerDto?.customerInfo?.iconPath}>
                                    {customerDto?.customerInfo?.iconPath ? null : customerDto?.username?.at(0)}
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

                {isMenuDisplayed ?
                    (
                        <Stack sx={{ display: MOBILE_VIEW }} justifyContent="center" alignItems="center">
                            {links.navbar.map((link) => (
                                <AppNavLink {...link} />
                            ))}
                        </Stack>
                    ) : (
                        <></>
                    )
                }
            </Container>
        </AppBar>
    );
}