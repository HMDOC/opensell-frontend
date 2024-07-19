import { Stack, Typography } from "@mui/material";
import "./style.css";

export default function AdPricePart({price = 0, isSold = true}) {
    return (
        <Stack direction="row" alignItems="center" spacing={0.5} useFlexGap>
            <Typography variant="h5" className={`ad-price-part-title ${isSold ? "ad-price-part-sold" : ""}`}>{price} $</Typography>
            {isSold ? <Typography variant="subtitle1" className="ad-price-part-box-sold">Sold</Typography> : <></>}
        </Stack>
    );
}