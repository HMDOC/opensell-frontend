import { Chip } from "@mui/material";

export default function AdTagPart(props: { label: string, onDelete?(): void }) {
    return (
        <Chip
            sx={{ fontSize: "16px" }}
            onDelete={props.onDelete}
            label={props.label}
        />
    );
}