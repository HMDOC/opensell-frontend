import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import InterestsIcon from '@mui/icons-material/Interests';

export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];

export default function AdShapeSelect(props: SelectorReaderProps) {
    return (
        <SelectorReader
            {...props}
            icon={<InterestsIcon />}
            title="Shape"
            options={SHAPE_ARRAY}
        />
    );
}
