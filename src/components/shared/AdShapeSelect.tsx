import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import InterestsIcon from '@mui/icons-material/Interests';

export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];
export const CATALOGUE_ARRAY: string[] = ["all", ...SHAPE_ARRAY];

export default function AdShapeSelect(props: SelectorReaderProps & { isSearch?: boolean }) {
    return (
        <SelectorReader
            {...props}
            icon={<InterestsIcon />}
            title="Shape"
            options={props.isSearch ? CATALOGUE_ARRAY : SHAPE_ARRAY}
        />
    );
}
