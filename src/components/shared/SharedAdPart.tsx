import { MUI_INPUT_VARIANT } from "@context/AppContext";
import "@css/component/part/SharedAdPart.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MenuItem, TextField } from "@mui/material";
import { ErrorMessage, FieldProps } from "formik";
import { ReactNode } from "react";
import { createRandomKey } from "../../services/RandomKeys";
import IconLabelError from "./part/IconLabelError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLink, faLock } from "@fortawesome/free-solid-svg-icons";
import { AdVisibility } from "@entities/dto/AdBuyerView";

export const MAX_PRICE = 999990;

/**
 * Function to get the icon of the visibility of an ad.
 * 
 * @param visibility 
 * @returns icon
 */
export function getVisibilityIcon(visibility: AdVisibility): ReactNode {
    switch (visibility) {
        case 0:
            return <FontAwesomeIcon icon={faEarthAmericas} />;
        case 1:
            return <FontAwesomeIcon icon={faLock} />
        case 2:
            return <FontAwesomeIcon icon={faLink} />
    }
}

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