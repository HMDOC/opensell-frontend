import { Stack, Typography } from "@mui/material";
import "./style.css";

export default function AdPricePart({price = 0, sold = true}) {
    return (
        <Stack direction="row" alignItems="center" spacing={0.5} useFlexGap>
            <Typography variant="h5" className={`ad-price-part-title ${sold ? "ad-price-part-sold" : ""}`}>{price} $</Typography>
            {sold ? <Typography variant="subtitle1" className="ad-price-part-box-sold">Sold</Typography> : <></>}
        </Stack>
    );
}