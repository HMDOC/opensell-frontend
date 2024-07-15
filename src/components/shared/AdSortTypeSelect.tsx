import { faEarthAmerica } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";

export const SORT_ARRAY: string[] = ["addedDate", "title", "price"];

export default function AdSortTypeSelect(props: SelectorReaderProps) {
    return (
        <>
            <SelectorReader
                {...props}
                iconProp={faEarthAmerica}
                title="SortBy"
                options={SORT_ARRAY}
            />
        </>
    );
}
