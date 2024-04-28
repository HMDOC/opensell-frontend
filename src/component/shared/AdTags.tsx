import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { ReactElement } from "react";
import { createRandomKey } from "../../services/RandomKeys";
import { HtmlCode } from "../../services/verification/HtmlCode";
import AdTagPart from "../part/AdView/AdTagPart";
import { IconLabelError } from "./SharedAdPart";

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
        if (props.tags) {

            let addError = verifyTag(e.target.value);

            if (addError != HtmlCode.SUCCESS) {
                props.setError(addError);
            } else {
                props.addTag(e.target.value);
                if (props.error != HtmlCode.SUCCESS) props.setError(HtmlCode.SUCCESS);
            }

            e.target.value = "";
        }
    };

    const onTypeEvent = (e: any): void => {
        e.target.value = e.target.value.toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('--', '-')
            .trim();
    }

    /**
     * @brief
     * Get a HtmlCode error and get the string result. This function should have a switch case.
     * 
     * @return The string representation of the error.
    */
    const getErrorValue = (): string => {
        switch (props.error) {
            case HtmlCode.LENGTH_EMPTY: return " cannot be empty";
            case HtmlCode.UNIQUE_FAILED: return " already exists";
            case HtmlCode.VALUE_AS_NOT_CHANGE: return " as no value changed."
        }
    }

    const deleteEvent = (tag: string): void => {
        props.deleteTag(tag);
        props.setError(HtmlCode.SUCCESS);
    }

    return (
        <>
            <div>
                {props.isSearch ?
                    (
                        <>
                            <h5>Tags</h5>
                            {props.error != HtmlCode.SUCCESS ?
                                <p style={{ color: "red" }}>Tag {getErrorValue()}</p> : <></>
                            }
                        </>
                    ) : (
                        <>
                            <IconLabelError iconProp={faHashtag} title="Tags" error={getErrorValue()} />
                            <br />
                        </>
                    )
                }

                <input placeholder={props.placeholder}
                    className={(props.isSearch) ? "" : "ad-tags-section"}
                    onChange={onTypeEvent}
                    onDoubleClick={(e: any) => addEvent(e)} name="adTags" />
            </div>
            <div>
                {props.tags?.map(value => (
                    <AdTagPart label={value} onDoubleClick={() => deleteEvent(value)} key={createRandomKey()} />
                ))}
            </div>
        </>
    );
}