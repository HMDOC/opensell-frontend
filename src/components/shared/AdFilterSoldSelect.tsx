import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export const SORT_ARRAY: any[] = [null, "true", "false"];

export default function AdFilterSoldSelect(props: SelectorReaderProps) {
    return (
        <>
            <SelectorReader
                {...props}
                icon={<ShoppingCartIcon />}
                title="FilterSold"
                options={SORT_ARRAY}
                valueIsOption={true}
            />
        </>
    );
}
