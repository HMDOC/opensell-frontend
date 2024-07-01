import { MUI_INPUT_VARIANT } from "@context/AppContext";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { TextField, Stack } from "@mui/material";
import { ErrorMessage, FieldArray } from "formik";
import { createRandomKey } from "../../services/RandomKeys";
import AdTagPart from "./part/AdView/AdTagPart";
import IconLabelError from "./part/IconLabelError";

/**
 * @brief
 * Common infrastructure for AdTags gestion between Ad modification and creation pages.
 * 
 * @author Achraf
 * 
 * @param props
 * @returns 
 */
export function AdTags(props: { isSearch?: boolean, placeholder?: string }) {
    const handleChange = (e: any): void => {
        let currentTag = (e.target.value).toLowerCase().replaceAll(' ', '-').replaceAll('--', '-').trim();

        // To do not let a user but a - at index 0
        if (currentTag[0] == '-' && currentTag.length == 1) {
            e.target.value = "";
        }

        else e.target.value = currentTag;
    };

    return (
        <FieldArray name="tags">
            {({ push, remove, form }) => (
                <>
                    <TextField
                        label={
                            <IconLabelError iconProp={faHashtag} title="Tags" isTitle={props.isSearch} />
                        }
                        variant={MUI_INPUT_VARIANT}
                        onChange={handleChange}
                        type="text"
                        name="tags"
                        sx={{width : "250px"}}
                        onBlur={form.handleBlur}
                        error={form.errors.tags && Boolean(form.touched.tags)}
                        helperText={<ErrorMessage name="tags" />}
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