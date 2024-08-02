import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import PublicIcon from '@mui/icons-material/Public';
export const SORT_ARRAY: any[] = [null, "true", "false"];

export default function AdFilterSoldSelect(props: SelectorReaderProps) {
    return (
        <>
            <SelectorReader
                {...props}
                icon={<PublicIcon />}
                title="FilterSold"
                options={SORT_ARRAY}
                valueIsOption={true}
            />
        </>
    );
}
