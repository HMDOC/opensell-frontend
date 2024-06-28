import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { ReactElement } from "react";
import { createRandomKey } from "../../services/RandomKeys";
import { HtmlCode } from "../../services/verification/HtmlCode";
import AdTagPart from "./part/AdView/AdTagPart";
import IconLabelError from "./part/IconLabelError";
import { TextField } from "@mui/material";
import { MUI_INPUT_VARIANT } from "@context/AppContext";

export type AdTagsError =
    "NONE" |
    "Tag cannot be empty" |
    "Tag already exists"
    ;

interface AdTagsProps {
    error: AdTagsError;
    setError(error: AdTagsError): void;

    /**
     * @brief
     * Extarnal state that will be modified by the function deleteTag and addTag.
     */
    tags: Array<string>;

    /**
     * @brief
     * Delete a tag from the state passed in parameter for tags property.
     * 
     * @void
     */
    deleteTag(tag: string): void;


    /**
     * @brief
     * Add a tag from the state passed in parameter for tags property.
     * 
     * @void
     */
    addTag(tag: string): void;
    isSearch?: boolean;
    placeholder?: string;
};

/**
 * @brief
 * Common infrastructure for AdTags gestion between Ad modification and creation pages.
 * 
 * @author Achraf
 * 
 * @param props
 * @returns 
 */
export function AdTags(props: AdTagsProps): ReactElement {
    const addEvent = (e: any, tag: string): void => {
        let addError: AdTagsError = "NONE";

        // Check for error
        if (!tag) addError = "Tag cannot be empty";
        else if (props.tags.includes(tag)) addError = "Tag already exists";

        // if error and error is not already their.
        if (addError !== "NONE") {
            if (addError != props.error) props.setError(addError);
        } else {
            props.addTag(tag);
            if (props.error !== "NONE") props.setError("NONE");
        }

        e.target.value = "";
    };

    const onTypeEvent = (e: any): void => {
        let nTarget = (e.target.value)
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('--', '-')
            .trim()
        ;

        // To do not let a user but a - at index 0
        if(nTarget[0] == '-' && nTarget.length == 1) {
            e.target.value = "";
        }
        
        else e.target.value = nTarget;
    }

    const deleteEvent = (tag: string): void => {
        props.deleteTag(tag);

        if (props.error != "NONE") {
            props.setError("NONE");
        }
    }

    return (
        <>
            <TextField 
                label={
                    <IconLabelError iconProp={faHashtag} title="Tags" isTitle={props.isSearch} />
                }
                variant={MUI_INPUT_VARIANT}
                onChange={onTypeEvent}
                type="text"
                error={props.error != "NONE"}
                helperText={props.error == "NONE" ? "" : props.error}
                onDoubleClick={(e: any) => addEvent(e, e.target.value)} name="tags"
            />

            <div>
                <br />
                {props.tags?.map(value => (
                    <AdTagPart label={value} onDoubleClick={() => deleteEvent(value)} key={createRandomKey()} />
                ))}
            </div>
        </>
    );
}