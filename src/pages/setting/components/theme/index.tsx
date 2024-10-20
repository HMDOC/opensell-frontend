import { getThemeIcon } from "@components/navbar/components/theme-toggle";
import { useAppContext } from "@context/AppContext";
import { ThemeOption } from "@context/Theme";
import { Card, CardContent, CardHeader, Divider, IconButton, Stack, Typography, useTheme } from "@mui/material";

const THEME_ARRAY = ["System theme", "Dark", "Light"];
const THEME_ICON_SIZE = "200px";

function SingleThemeChoice(props: { theme: ThemeOption, action(theme: ThemeOption): void }) {
    const theme = useTheme();

    return (
        <IconButton onClick={() => props.action(props.theme)}>
            <Stack sx={{color : theme.palette.text.primary as any}}>
                {getThemeIcon(props.theme, THEME_ICON_SIZE)}
                <Typography>{THEME_ARRAY[props.theme]}</Typography>
            </Stack>
        </IconButton>
    );
}

export default function SettingTheme() {
    const { changeTheme } = useAppContext();

    return (
        <Card>
            <CardHeader
                title="Theme"
            />
            <Divider />

            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="center" flexWrap="wrap" spacing={6} useFlexGap>
                    <SingleThemeChoice theme={ThemeOption.BROWSER_DEFAULT} action={changeTheme} />
                    <SingleThemeChoice theme={ThemeOption.DARK} action={changeTheme} />
                    <SingleThemeChoice theme={ThemeOption.LIGHT} action={changeTheme} />
                </Stack>
            </CardContent>
        </Card>
    );
}