import { Theme } from "@context/Theme";
import { Avatar, SxProps } from "@mui/material";
import { getCustomerIconUrl } from "@services/file";

export const AVATAR_SIZE = { width: 150, height: 150 };

export default function ProfilIcon(props: { username?: string, userIcon?: string, avatarSize?: SxProps<Theme> }) {
    return (
        <Avatar sx={props.avatarSize} src={getCustomerIconUrl(props.userIcon)}>{props.userIcon ? null : props.username?.[0]}</Avatar>
    )
}