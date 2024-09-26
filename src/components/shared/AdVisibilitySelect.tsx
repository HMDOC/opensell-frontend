import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import PublicIcon from '@mui/icons-material/Public';

export const VISIBILITY_ARRAY: string[] = ["public", "private", "link only"];

export default function AdVisibilitySelect(props: SelectorReaderProps) {
    return (
        <SelectorReader
            {...props}
            icon={<PublicIcon />}
            title="Visibility"
            options={VISIBILITY_ARRAY}
        />
    );
}
