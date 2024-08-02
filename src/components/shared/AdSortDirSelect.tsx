import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import PublicIcon from '@mui/icons-material/Public';
export const SORT_ARRAY: any[] = ["Ascending", "Descending"];

export default function AdSortDirSelect(props: SelectorReaderProps) {
    return (
        <>
            <SelectorReader
                {...props}
                icon={<PublicIcon />}
                title="FilterSold"
                options={SORT_ARRAY}
            />
        </>
    );
}
