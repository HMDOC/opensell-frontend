import { FormControlLabel, Switch } from "@mui/material";
import { FieldProps } from "formik";

export interface AdCheckboxProps extends FieldProps {
    label: string;
}

export function AdCheckbox(props: AdCheckboxProps) {
    return (
        <FormControlLabel 
            label={props.label}
            control={
                <Switch name={props.field.name} {...props.field} />
            } 
        />
    );
}//