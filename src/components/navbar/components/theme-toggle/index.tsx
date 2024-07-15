import MuiMenuWithOptions from "@components/shared/mui-menu";
import { useAppContext } from "@context/AppContext";
import { ThemeOption } from "@context/Theme";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

/**
 * Function to get the icon that correspond to the theme in parameter.
 */
function getThemeIcon(theme: ThemeOption) {
    switch (theme) {
        case ThemeOption.DARK: return <LightModeIcon />
        case ThemeOption.LIGHT: return <DarkModeIcon />
        default: return <SettingsBrightnessIcon />
    }
}

/**
 * The button with the menu to change the app theme.
 */
export default function ThemeToggle() {
    const { theme, changeTheme } = useAppContext();

    return (
        <>
            <MuiMenuWithOptions
                menuIcon={getThemeIcon(theme)}
                options={[
                    { label: "dark", icon: getThemeIcon(ThemeOption.DARK), action: () => changeTheme(ThemeOption.DARK) },
                    { label: "light", icon: getThemeIcon(ThemeOption.LIGHT), action: () => changeTheme(ThemeOption.LIGHT) },
                    { label: "system", icon: getThemeIcon(ThemeOption.BROWSER_DEFAULT), action: () => changeTheme(ThemeOption.BROWSER_DEFAULT) }
                ]}
            />
        </>
    );
}