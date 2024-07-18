import { Stack } from "@mui/material";
import { ReactNode } from "react";

const MARGIN_RIGHT = "3px";

export function IconLabel(props: { title: string, icon?: ReactNode,  }) {
    return (
        <Stack spacing={0.25} direction="row" alignItems="center">
            {props.icon}
            <label>{props.title}</label>
        </Stack>
    );
}