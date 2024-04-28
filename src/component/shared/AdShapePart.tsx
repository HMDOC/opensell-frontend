import { faShapes } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader } from "./SharedAdPart";
import { AdShape } from "../../entities/dto/AdBuyerView";

export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];

interface AdShapePartProps {
    defaultValue?: AdShape;
    isModif?: boolean;
    isSearch?: boolean;
    request?(value: any): void;
}

export default function AdShapePart(props: AdShapePartProps) {
    return(
        <SelectorReader
            id="shapeId"
            name="shapeId"
            iconProp={faShapes} 
            title="Shape" 
            options={SHAPE_ARRAY} 
            request={props.request} 
            defaultValue={props.defaultValue} 
            isSearch={props.isSearch}
            isModif={props.isModif} />
    );
}
