import { faEarthAmerica } from "@fortawesome/free-solid-svg-icons";
import { AdShapePartProps } from "./AdShapeSelect";
import { SelectorReader } from "./SharedAdPart";

export const VISIBILITY_ARRAY: string[] = ["public", "private", "link only"];

export default function AdVisibilitySelect(props: AdShapePartProps) {
    return(
        <SelectorReader
            name="visibility"
            iconProp={faEarthAmerica} 
            title="Visibility" 
            options={VISIBILITY_ARRAY} 
            request={props.request} 
            defaultValue={props.defaultValue} />
    );
}
