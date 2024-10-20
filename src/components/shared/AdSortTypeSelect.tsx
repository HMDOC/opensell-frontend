import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import PublicIcon from '@mui/icons-material/Public';
export const SORT_ARRAY: string[] = ["addedDate", "title", "price"];

export default function AdSortTypeSelect(props: SelectorReaderProps) {
    return (
        <>
            <SelectorReader
                {...props}
                icon={<PublicIcon />}
                title="Sort by"
                options={SORT_ARRAY}
                valueIsOption={true}
            />
        </>
    );
}
