import AdPricePart from "@components/shared/ad/price-part";
import AdTagPart from "@components/shared/ad/tag-part";
import ProfilIcon from "@components/shared/ProfilIcon";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { DESKTOP_VIEW, MOBILE_VIEW } from "@context/AppContext";
import { Card, CardContent, CardHeader, Chip, Container, Stack, Typography } from "@mui/material";
import AdInfosPart from "@pages/ad-view/components/ad-infos-part";
import { getAdBuyerView } from "@services/ad/catalog";
import { createRandomKey } from "@utils/RandomKeys";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdCategoryPart from "./components/ad-type-part";
import FrontImage from "./components/front-image";
import ImageViewer from "./components/image-viewer";
import SideImages from "./components/side-images";
import AdViewDto from "@services/ad/catalog/dto/AdViewDto";

/**
 * Function that increase the index of the current picture
 * to iterate over a list of images.
 * 
 * @author Achraf
*/
const changePicture = (isNext: boolean, currentPicture: number, listLength: number) => {
    if (listLength > 1) {
        if (isNext) {
            if (currentPicture < listLength - 1) return currentPicture + 1;
            else return 0;
        } else {
            if (currentPicture > 0) return currentPicture - 1;
            else return listLength - 1;
        }
    } else return 0;
};

/**
 * Component for that will be shown when a buyer click on a ad.
 * 
 * @author Achraf
*/
export default function AdView() {
    const { id } = useParams();

    const [currentPicture, setCurrentPicture] = useState<number>(0);
    const [promiseResult, setPromiseResult] = useState<any>(undefined);
    const [isPicturePopup, setIsPicturePopup] = useState(false);

    const adBuyerView: AdViewDto = promiseResult?.data;
    const imagesLength = adBuyerView?.adImages?.length;

    useEffect(() => {
        getAdBuyerView(id as any).then(res => {
            setPromiseResult(res);
        });
    }, []);

    const nextOrPrevious = (isNext: boolean) => {
        let newIndex = changePicture(isNext, currentPicture, imagesLength!);
        if (newIndex !== currentPicture) {
            setCurrentPicture(newIndex);
        }
    };

    const loadImageFromClick = (pictureIndex: number) => {
        if (currentPicture !== pictureIndex) {
            setCurrentPicture(pictureIndex);
        }

        setIsPicturePopup(true);
    };

    return (
        <>
            <title>{adBuyerView?.adTitle}</title>
            {adBuyerView ?
                (
                    <Card component={Container} sx={{ borderRadius: "20px" }}>
                        <CardHeader
                            title={
                                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap" useFlexGap>
                                        {getVisibilityIcon(adBuyerView?.adVisibility!)}
                                        <Typography variant="h3">{adBuyerView?.adTitle}</Typography>
                                        <AdCategoryPart type={adBuyerView?.adCategory?.name!} />
                                    </Stack>

                                    <Chip
                                        component={Link}
                                        to={`/user/${adBuyerView?.username}`}
                                        clickable
                                        sx={{ height: "100%" }}
                                        icon={<ProfilIcon src={adBuyerView?.userIcon} username={adBuyerView?.username} />}
                                        label={<Typography variant="subtitle1">{adBuyerView?.username}</Typography>}
                                    />
                                </Stack>
                            }
                            subheader={
                                <AdPricePart price={adBuyerView?.adPrice} sold={adBuyerView?.isAdSold} />
                            }
                        >
                        </CardHeader>

                        <CardContent>
                            <Stack spacing={1.5}>

                                <ImageViewer
                                    adImages={adBuyerView?.adImages}
                                    currentPicture={currentPicture}
                                    nextOrPrevious={nextOrPrevious}
                                    onClose={() => setIsPicturePopup(false)}
                                    open={isPicturePopup}
                                />

                                {imagesLength !== 0 ?
                                    (
                                        <>
                                            <Stack direction="row" display={DESKTOP_VIEW} spacing={1.5}>
                                                <FrontImage
                                                    action={() => loadImageFromClick(0)}
                                                    imagesLength={imagesLength}
                                                    path={adBuyerView?.adImages?.[0]?.path}
                                                />

                                                <SideImages images={adBuyerView?.adImages?.slice(1, 4)?.map(img => img.path)} openImageAction={loadImageFromClick} />
                                            </Stack>

                                            <Stack sx={{ display: MOBILE_VIEW }}>
                                                <FrontImage
                                                    action={() => loadImageFromClick(0)}
                                                    path={adBuyerView?.adImages?.[0]?.path}
                                                    isMobile
                                                />
                                            </Stack>
                                        </>
                                    ) :
                                    (
                                        <></>
                                    )
                                }

                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" spacing={1}>
                                        {adBuyerView?.adTagsName?.map(value => (
                                            <AdTagPart key={createRandomKey()} label={value} />
                                        ))}
                                    </Stack>

                                    <Typography variant="body1">{adBuyerView?.adDescription}</Typography>
                                    <AdInfosPart
                                        location={adBuyerView?.adAddress}
                                        phone={adBuyerView?.userPhone}
                                        publishDate={adBuyerView?.adAddedDate}
                                        shape={adBuyerView?.adShape} />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="h3" textAlign="center">
                        {
                            promiseResult?.status == 403 ? "You do not have access to this ad."
                                : (
                                    promiseResult?.status == 404 ? "Ad not found."
                                        : (
                                            "Server error."
                                        )
                                )
                        }
                    </Typography>
                )

            }
        </>
    );
}