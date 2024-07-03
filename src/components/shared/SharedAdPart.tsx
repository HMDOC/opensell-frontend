import { MUI_INPUT_VARIANT } from "@context/AppContext";
import "@css/component/part/SharedAdPart.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MenuItem, TextField } from "@mui/material";
import { ErrorMessage, FieldProps } from "formik";
import { ReactNode } from "react";
import { createRandomKey } from "../../services/RandomKeys";
import IconLabelError from "./part/IconLabelError";

export const MAX_PRICE = 999990;

export interface SelectorReaderProps extends FieldProps {
    title: string;
    iconProp: IconProp;
    options?: Array<String>;
    children?: ReactNode;
}

/*
Added the useEffect and the useState because the component was not working in AdModification.
*/
export function SelectorReader(props: SelectorReaderProps) {
    const { name } = props.field;
    const { errors, touched } = props.form;

    return (
        <>
            <TextField
                label={
                    <IconLabelError {...props} />
                }
                variant={MUI_INPUT_VARIANT}
                sx={{
                    width: 200
                }}
                {...props.field}
                error={!!errors[name] && touched[name] as boolean}
                helperText={<ErrorMessage name={props.field.name} />}
                select
            >
                {
                    (props.children) ??
                    (
                        props.options?.map((option, index) => (
                            <MenuItem key={createRandomKey()} value={index}>{option}</MenuItem>
                        ))
                    )
                }
            </TextField>
        </>
    );
}