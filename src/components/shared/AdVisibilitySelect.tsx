import { faEarthAmerica } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";

export const VISIBILITY_ARRAY: string[] = ["public", "private", "link only"];

export default function AdVisibilitySelect(props: SelectorReaderProps) {
    return (
        <SelectorReader
            {...props}
            iconProp={faEarthAmerica}
            title="Visibility"
            options={VISIBILITY_ARRAY}
        />
    );
}
