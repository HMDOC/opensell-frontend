import { faShapes } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";

export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];

export default function AdShapeSelect(props: SelectorReaderProps) {
    return (
        <SelectorReader
            {...props}
            iconProp={faShapes}
            title="Shape"
            options={SHAPE_ARRAY}
        />
    );
}
