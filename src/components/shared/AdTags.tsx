import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { ReactElement } from "react";
import { createRandomKey } from "../../services/RandomKeys";
import { HtmlCode } from "../../services/verification/HtmlCode";
import AdTagPart from "./part/AdView/AdTagPart";
import IconLabelError from "./part/IconLabelError";
import { TextField } from "@mui/material";
import { MUI_INPUT_VARIANT } from "@context/AppContext";

interface AdTagsProps {
    /**
     * Error are handled at distance.
     */
    error: HtmlCode;
    setError(error: HtmlCode): void;

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
    /**
     * @brief
     * Check if the new tag have an error before putting it in the list.
     * 
     * @return The error type.
    */
    const verifyTag = (tag: string): HtmlCode => {
        // If empty
        if (!tag) return HtmlCode.LENGTH_EMPTY;

        // If tag already in the box
        if (props.tags.includes(tag)) return HtmlCode.UNIQUE_FAILED;
        else return HtmlCode.SUCCESS;
    }

    const addEvent = (e: any): void => {
        e.preventDefault();
        console.log("AdEvent");

        if (props.tags) {

            let addError = verifyTag(e.target.value);

            if (addError !== HtmlCode.SUCCESS) {
                props.setError(addError);
            } else {
                props.addTag(e.target.value);
                if (props.error !== HtmlCode.SUCCESS) props.setError(HtmlCode.SUCCESS);
            }

            e.target.value = "";
        }
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

    /**
     * @brief
     * Get a HtmlCode error and get the string result. This function should have a switch case.
     * 
     * @return The string representation of the error.
    */
    const getErrorValue = (): string => {
        switch (props.error) {
            case HtmlCode.LENGTH_EMPTY: return "Tags cannot be empty";
            case HtmlCode.UNIQUE_FAILED: return "Tags already exists";
            case HtmlCode.VALUE_AS_NOT_CHANGE: return "Tags as no value changed."
        }
    }

    const deleteEvent = (tag: string): void => {
        props.deleteTag(tag);

        if(props.error != HtmlCode.SUCCESS) {
            props.setError(HtmlCode.SUCCESS);
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
                error={!!getErrorValue()}
                helperText={getErrorValue()}
                onDoubleClick={(e: any) => addEvent(e)} name="adTags"
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