import { MUI_INPUT_VARIANT } from "@context/AppContext";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { TextField, Stack } from "@mui/material";
import { ErrorMessage, FieldArray } from "formik";
import { createRandomKey } from "../../../../services/RandomKeys";
import AdTagPart from "../tag-part";
import IconLabelError from "../../IconLabelError";

/**
 * @brief
 * Common infrastructure for AdTags gestion between Ad modification and creation pages.
 * 
 * @author Achraf
 * 
 * @param props
 * @returns 
 */
export function AdTags(props: { name: string, isSearch?: boolean, placeholder?: string }) {
    const handleChange = (e: any): void => {
        let currentTag = (e.target.value).toLowerCase().replaceAll(' ', '-').replaceAll('--', '-').trim();

        // To do not let a user but a - at index 0
        if (currentTag[0] == '-' && currentTag.length == 1) {
            e.target.value = "";
        }

        else e.target.value = currentTag;
    };

    return (
        <FieldArray name={props.name}>
            {({ push, remove, form }) => (
                <>
                    <TextField
                        label={
                            <IconLabelError iconProp={faHashtag} title="Tags" isTitle={props.isSearch} />
                        }
                        variant={MUI_INPUT_VARIANT}
                        onChange={handleChange}
                        type="text"
                        name={props.name}
                        sx={{width : "250px"}}
                        onBlur={form.handleBlur}
                        error={form.errors[props.name] && Boolean(form.touched[props.name])}
                        helperText={<ErrorMessage name={props.name} />}
                        onDoubleClickCapture={(e: any) => {
                            if (e.target.value?.length > 0 && !form.values.tags?.includes(e.target.value)) {
                                push(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />

                    <Stack flexWrap={"wrap"} direction="row" spacing={1} width={600}>
                        {form.values.tags?.map(value => (
                            <AdTagPart label={value} onDoubleClick={() => remove(form.values.tags?.indexOf(value))} key={createRandomKey()} />
                        ))}
                    </Stack>
                </>
            )}
        </FieldArray>
    );
}