import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import ImportExportIcon from '@mui/icons-material/ImportExport';
export const SORT_ARRAY: any[] = ["Ascending", "Descending"];

export default function AdSortDirSelect(props: SelectorReaderProps) {
    return (
        <>
            <SelectorReader
                {...props}
                icon={<ImportExportIcon />}
                title="Sort order"
                options={SORT_ARRAY}
            />
        </>
    );
}
