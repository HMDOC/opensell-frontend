import AdPricePart from "@components/shared/ad/price-part";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { Card, CardHeader, CardMedia, Stack, Typography } from "@mui/material";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";
import { ReactNode } from "react";

type SmallAd = {
    isSearch?: boolean;
    action?: ReactNode;
    goToAd?(): void;
    className?: string;
} & AdPreviewDto;

/**
 * The component shared by AdPreview(catalog) and Display ad(my-ads).
*/
export const SmallAd = (props: SmallAd) => {
    return (
        <Card className={props.className} onClick={props.goToAd} sx={{ width: "350px" }}>
            <CardMedia component="img" image={props.firstImage} width="220px" height="150px" />

            <CardHeader
                title={<Typography component={Stack} direction="row" alignItems="center" variant="h4">{props.isSearch ? <></> : getVisibilityIcon(props.visibility)}{props.title}</Typography>}
                subheader={
                    <AdPricePart price={props.price} isSold={props.isSold} />
                }
                action={
                    props.isSearch ? <></> : props.action
                }
            />
        </Card>
    );
}