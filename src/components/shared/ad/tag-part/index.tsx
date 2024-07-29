import { Chip } from "@mui/material";

export default function AdTagPart({ label = "", onDelete = () => { } }) {
    return (
        <Chip
            sx={{ fontSize: "16px" }}
            onDelete={onDelete}
            label={label}
        />
    );
}