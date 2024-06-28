import { Chip } from "@mui/material";

export default function AdTagPart({label = "", onDoubleClick = undefined, isAdView = false}) {
    return(
        <Chip
            sx={{ fontSize: "16px"}}
            onDelete={onDoubleClick}
            label={label}
        />
    );
}