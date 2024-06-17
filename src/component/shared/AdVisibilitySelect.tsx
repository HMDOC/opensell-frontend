import { faEarthAmerica, faList, faShapes } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader } from "@shared/SharedAdPart";
import { AdShapePartProps } from "./AdShapeSelect";

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
