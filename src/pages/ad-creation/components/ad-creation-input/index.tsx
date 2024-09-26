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
                helperText={<ErrorMessage name={name} />}
                {...props.field}
            />
        </>
    )
}