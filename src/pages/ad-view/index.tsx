import AdInfosPart from "@pages/ad-view/components/ad-infos-part";
import AdPricePart from "@components/shared/ad/price-part";
import AdTagPart from "@components/shared/ad/tag-part";
import AdTypePart from "./components/ad-type-part";
import ProfilIcon from "@components/shared/ProfilIcon";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { AdBuyerView } from "@entities/dto/AdBuyerView";
import { Card, CardContent, CardHeader, Chip, Container, Stack, Typography } from "@mui/material";
import { getAdByLink } from "@services/AdService";
import { createRandomKey } from "@services/RandomKeys";
import { AxiosResponse } from "axios";
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageViewer from "./components/image-viewer";
import "./style.css";
import SideImages from "./components/side-images";

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

export function AdMapping(props: { request: Promise<AxiosResponse<AdBuyerView, any>>, children?: any }) {
    const [currentPicture, setCurrentPicture] = useState<number>(0);
    const [adBuyerView, setAdBuyerView] = useState<AdBuyerView>(undefined);
    const [isPicturePopup, setIsPicturePopup] = useState(false);

    useEffect(() => {
        props.request.then(res => {
            if (res?.data) {
                setAdBuyerView(res?.data);
            }
        });
    }, []);

    const nextOrPrevious = (isNext: boolean) => {
        let newIndex = changePicture(isNext, currentPicture, adBuyerView?.adImages?.length);
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
            <Card component={Container} sx={{ borderRadius: "20px" }}>
                <CardHeader
                    title={
                        <>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                    {getVisibilityIcon(adBuyerView?.adVisibility)}
                                    <h1>{adBuyerView?.adTitle}</h1>
                                    <AdTypePart type={adBuyerView?.adType?.name} />
                                </Stack>

                                <Chip
                                    component={Link}
                                    clickable
                                    sx={{ height: "100%" }}
                                    to={`/user/${adBuyerView?.username}`}
                                    icon={<ProfilIcon src={adBuyerView?.userIcon} username={adBuyerView?.username} />}
                                    label={<Typography variant="subtitle1">{adBuyerView?.username}</Typography>}
                                />
                            </Stack>

                            <AdPricePart price={adBuyerView?.adPrice} isSold={adBuyerView?.isAdSold} />
                        </>
                    }
                >

                </CardHeader>
                <CardContent component={Stack} spacing={1.5}>
                    {adBuyerView ?
                        (
                            <>
                                <ImageViewer
                                    adImages={adBuyerView?.adImages}
                                    currentPicture={currentPicture}
                                    nextOrPrevious={nextOrPrevious}
                                    onClose={() => setIsPicturePopup(false)}
                                    open={isPicturePopup}

                                />

                                {adBuyerView?.adImages?.length !== 0 ?
                                    (
                                        <Stack direction="row" >
                                            <img onClick={() => loadImageFromClick(0)} className="ad-view-big-image imgFit" src={adBuyerView?.adImages[0]?.path} />

                                            <SideImages images={adBuyerView?.adImages?.slice(1, 4)?.map(img => img.path)} openImageAction={loadImageFromClick} />
                                        </Stack>
                                    ) :
                                    (
                                        <></>
                                    )
                                }

                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" spacing={1}>
                                        {adBuyerView?.adTagsName?.map(value => (
                                            <AdTagPart key={createRandomKey()} label={value} isAdView />
                                        ))}
                                    </Stack>

                                    <Typography variant="body1">{adBuyerView?.adDescription}</Typography>
                                    <AdInfosPart
                                        location={adBuyerView?.adAddress}
                                        phone={adBuyerView?.userPhone}
                                        publishDate={adBuyerView?.adAddedDate}
                                        shape={adBuyerView?.adShape} />
                                </Stack>
                            </>
                        ) : (
                            <>
                                <p>The ad does not exists.</p>
                                <Link to="/">Main menu</Link>
                            </>
                        )
                    }
                </CardContent>
            </Card>
        </>
    );
}

/**
 * Component for that will be shown when a buyer click on a ad.
 * 
 * @author Achraf
*/
const AdView = (): ReactElement => {
    const { link } = useParams();

    return (
        <AdMapping request={getAdByLink(link)} />
    );
}

export default AdView;