import { Typography } from "@mui/material";

export default function AdCategoryPart(props: { type: string }) {
    return (
        <Typography
            color="white"
            bgcolor="primary.main"
            textTransform="uppercase"
            fontWeight="bold"
            padding="7px"
            borderRadius="5px"
        >
            {props.type}
        </Typography>
    );
}