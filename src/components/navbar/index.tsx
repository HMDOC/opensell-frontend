import { MuiMenu, MuiMenuItem } from '@components/shared/mui-menu';
import { DESKTOP_VIEW, MOBILE_VIEW, useAppContext } from '@context/AppContext';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from '@mui/icons-material/Settings';
import WebIcon from '@mui/icons-material/Web';
import { Box, Button, Divider, Drawer, IconButton, ListItem, ListItemButton, ListItemText, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createRandomKey } from '@utils/RandomKeys';
import { ReactElement, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppNavLink from './components/app-nav-link';
import Logo from './components/logo';
import links from "./links.json";
import { getCustomerIconUrl } from '@services/file';

const drawerWidth = "100%";

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
        <>
            <AppBar sx={{ bgcolor: "background.paper", zIndex: (theme) => theme.zIndex.drawer + 1 }} position="fixed" enableColorOnDark color="transparent">
                <Container maxWidth={false}>
                    <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
                        {/* <ThemeToggle /> */}

                        {/* MOBILE SECTION */}
                        <Stack display={MOBILE_VIEW} direction="row" alignItems="center">
                            <IconButton onClick={() => setIsMenuDisplayed(!isMenuDisplayed)}>
                                {isMenuDisplayed ? <CloseIcon sx={{ color: "text.primary" }} /> : <MenuIcon sx={{ color: "text.primary" }} />}
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
                                    <Avatar src={getCustomerIconUrl(customerDto?.iconPath)}>
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
                                    <Link to="/login">
                                        <Button variant="outlined">Sign in</Button>
                                    </Link>

                                    <Box sx={{ display: DESKTOP_VIEW }}>
                                        <Link to="/signup">
                                            <Button>Get Started</Button>
                                        </Link>
                                    </Box>
                                </Stack>
                            )
                        }
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                sx={{
                    display: MOBILE_VIEW,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
                open={isMenuDisplayed} onClose={() => setIsMenuDisplayed(false)}>
                <Toolbar />

                <Stack component={ListItem}>
                    {links.navbar.map(link => (
                        <ListItemButton onClick={() => { setIsMenuDisplayed(false); navigate(link.path); }} key={link.label}>
                            <ListItemText primary={link.label} />
                        </ListItemButton>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
}