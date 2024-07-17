import AdPricePart from "@components/shared/ad/price-part";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { Card, CardHeader, CardMedia } from "@mui/material";
import { ReactNode } from "react";

type SmallAd = {
    isSearch?: boolean;

    firstImage: string;
    visibility?: number;
    title: string;
    isSold?: boolean;
    price: number;
    action?: ReactNode;
    goToAd?(): void;

    className?: string;
};

/**
 * The component shared by AdPreview(catalog) and Display ad(my-ads).
*/
export const SmallAd = (props: SmallAd) => {
    return (
        <Card className={props.className} onClick={props.goToAd} sx={{ width: "350px" }}>
            <CardMedia component="img" image={props.firstImage} width="220px" height="150px" />

            <CardHeader
                title={<h2>{props.isSearch ? <></> : getVisibilityIcon(props.visibility)}{props.title}</h2>}
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