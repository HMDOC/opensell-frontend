import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ErrorMessage, FieldProps } from 'formik';

export default function FormikDatePicker(props: { label: string } & FieldProps) {
    const { name, value } = props.field;
    const { errors, touched } = props.form;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                name={name}
                onChange={(e) => props.form.setFieldValue(name, e)}
                label={props.label}
                slotProps={{
                    textField: {
                        error: !!errors[name] && touched[name] as boolean,
                        helperText: <ErrorMessage name={name} />
                    }
                }}
            />
        </LocalizationProvider>
    );
}