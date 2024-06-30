import { MUI_INPUT_VARIANT } from "@context/AppContext";
import { TextField } from "@mui/material";
import { ErrorMessage, FieldProps } from "formik";
import { HTMLInputTypeAttribute } from "react";

// Recreated this interface to do not have problem with the other components.
export interface AdCreationInputProps extends FieldProps {
    type?: HTMLInputTypeAttribute;
    label: string;
    isTextArea?: boolean;
    icon?: any;
}

/**
 * @author Olivier Mansuy
 * @modifiedBy Achraf
 */
export function AdCreationInput(props: AdCreationInputProps) {
    const { name } = props.field;
    const { errors, touched } = props.form;

    return (
        <>
            <TextField
                label={
                    <label style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {props.icon}
                        {props.label}
                    </label>
                }
                error={!!errors[name] && touched[name] as boolean}
                multiline={props.isTextArea}
                rows={props.isTextArea ? 10 : undefined}
                type={props.type ?? "text"}
                variant={MUI_INPUT_VARIANT}
                helperText={<ErrorMessage name={name} />}
                sx={{ width: props.isTextArea ? "1000px" : "300px" }}
                {...props.field}
            />
        </>
    )
}