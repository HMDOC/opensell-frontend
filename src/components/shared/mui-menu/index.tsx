import { IconButton, Menu, MenuItem, Typography, Stack, ListItemIcon } from "@mui/material";
import { createRandomKey } from "@services/RandomKeys";
import { ReactNode, useState } from "react";

type MuiMenuItem = {
    label: string;
    icon?: ReactNode;
    action?(): void;

    /**
     * The action that is the same for every Item, it will be executed after action(). For
     * example, it could be router.refresh().
    */
    basicAction?(): void;
}

type MuiMenuProps = {
    menuIcon: ReactNode;
    children: ReactNode;
}

export function MuiMenu(props: MuiMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                {props.menuIcon}
            </IconButton>


            {
                // Putted this condition to fix a bug.
                anchorEl != null ?
                (
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        onClick={handleClose}
                    >
                        {props.children}
                    </Menu>
                ) : <></>
            }
        </>
    );
}

type MuiMenuWithOptionsProps = {
    options: MuiMenuItem[];
    menuIcon: ReactNode;
}

export function MuiMenuItem(props: MuiMenuItem) {
    return (
        <MenuItem key={props.label} onClick={() => { props.action?.(); props.basicAction?.() }}>
            {props.icon ? <ListItemIcon>{props.icon}</ListItemIcon> : <></>}
            {props.label}
        </MenuItem>
    );
}

export default function MuiMenuWithOptions(props: MuiMenuWithOptionsProps) {
    return (
        <MuiMenu menuIcon={props.menuIcon}>
            {props.options?.map(option => (
                <MuiMenuItem
                    key={createRandomKey()}
                    {...option}
                />
            ))}
        </MuiMenu>
    );
}
