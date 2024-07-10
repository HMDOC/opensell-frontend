import { IconButton, Menu, MenuItem, Typography, Stack } from "@mui/material";
import { ReactNode, useState } from "react";

type MuiMenuProps = {
    options: { label: string, icon: ReactNode, action(): void }[];
    menuIcon: ReactNode;
}

export default function MuiMenu(props: MuiMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                {props.menuIcon}
            </IconButton>

            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                {props.options?.map(option => (
                    <MenuItem key={option.label} onClick={option.action}>
                        <Stack direction={"row"} spacing={1}>
                            {option.icon}
                            <Typography variant="inherit">{option.label}</Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}