import { Typography } from "@mui/material";
import "./style.css";

export default function AdTypePart(props: {type: string}) {
    return(
        <Typography className="ad-type-part">{props.type?.toUpperCase()}</Typography>
    );
}