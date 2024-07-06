import { Avatar } from "@mui/material";

export default function ProfilIcon(props: { username: string, src?: string }) {
    return (
        <Avatar src={props.src}>{props.src ? null : props.username?.[0]}</Avatar>
    )
}