import AdPricePart from "@components/shared/ad/price-part";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { Card, CardActionArea, CardHeader, CardMedia, Stack, Typography } from "@mui/material";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";
import { getAdImageUrl } from "@services/file";
import { ReactNode } from "react";

type SmallAdProps = {
    isSearch?: boolean;
    action?: ReactNode;
    goToAd?(): void;
    className?: string;
} & AdPreviewDto;

/**
 * The component shared by AdPreview(catalog) and Display ad(my-ads).
*/
export const SmallAd = (props: SmallAdProps) => {
    return (
        <Card onClick={props.goToAd} sx={{ width: "300px" }} component={props.isSearch ? CardActionArea : Stack}>
            <CardMedia component="img" image={getAdImageUrl(props.firstImage)} width="220px" height="150px" />

            <CardHeader
                sx={{
                    "& .MuiCardHeader-content": {
                        overflow: "auto"
                    }
                }}
                title={
                    <Stack direction="row" alignItems="center">
                        {props.isSearch ? <></> : getVisibilityIcon(props.visibility!)}
                        <Typography variant="h5" overflow={"hidden"} whiteSpace={"nowrap"}
                            textOverflow="ellipsis">{props.title}</Typography>
                    </Stack>
                }
                subheader={
                    <AdPricePart price={props.price} sold={props.sold} />
                }
                action={
                    props.isSearch ? <></> : props.action
                }
            />
        </Card>
    );
}