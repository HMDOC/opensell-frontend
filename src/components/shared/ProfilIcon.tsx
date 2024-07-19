import { Theme } from "@context/Theme";
import { Avatar, SxProps } from "@mui/material";

export const AVATAR_SIZE = { width: 150, height: 150 };

export default function ProfilIcon(props: { username: string, src?: string, avatarSize?: SxProps<Theme> }) {
    return (
        <Avatar sx={props.avatarSize} src={props.src}>{props.src ? null : props.username?.[0]}</Avatar>
    )
}