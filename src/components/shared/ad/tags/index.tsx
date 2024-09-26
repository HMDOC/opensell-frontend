import { IconLabel } from "@components/shared/IconLabel";
import TagIcon from '@mui/icons-material/Tag';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ErrorMessage, FieldArray } from "formik";
import { createRandomKey } from "../../../../utils/RandomKeys";
import AdTagPart from "../tag-part";

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
                            <IconLabel icon={<TagIcon />} title="Tags" />
                        }
                        onChange={handleChange}
                        type="text"
                        name={props.name}
                        sx={{ width: "250px" }}
                        onBlur={form.handleBlur}
                        error={Boolean(form.errors[props.name]) && Boolean(form.touched[props.name])}
                        helperText={<ErrorMessage name={props.name} />}
                        onDoubleClickCapture={(e: any) => {
                            if (e.target.value?.length > 0 && !form.values.tags?.includes(e.target.value)) {
                                push(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />

                    <Stack flexWrap={"wrap"} direction="row" gap={1} maxWidth={600}>
                        {form.values.tags?.map((value: string) => (
                            <AdTagPart label={value} onDelete={() => remove(form.values.tags?.indexOf(value))} key={createRandomKey()} />
                        ))}
                    </Stack>
                </>
            )}
        </FieldArray>
    );
}