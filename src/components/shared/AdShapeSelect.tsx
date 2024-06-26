import { faShapes } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader } from "./SharedAdPart";
import { AdShape } from "../../entities/dto/AdBuyerView";

export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];

export interface AdShapePartProps {
    defaultValue?: any;
    request?(value: any): void;
}

export default function AdShapeSelect(props: AdShapePartProps) {
    return(
        <SelectorReader
            name="shape"
            iconProp={faShapes} 
            title="Shape" 
            options={SHAPE_ARRAY} 
            request={props.request} 
            defaultValue={props.defaultValue} />
    );
}
