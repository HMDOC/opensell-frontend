import AdInfosPart from "@components/shared/part/AdView/AdInfosPart";
import AdPricePart from "@components/shared/part/AdView/AdPricePart";
import AdTagPart from "@components/shared/part/AdView/AdTagPart";
import AdTypePart from "@components/shared/part/AdView/AdTypePart";
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
import "./style.scss";

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
                                to={`/user/${adBuyerView?.userLink}`}
                                icon={<ProfilIcon src={adBuyerView?.userIcon} username={adBuyerView?.username} />}
                                label={<Typography variant="subtitle1">{adBuyerView?.username}</Typography>}
                            />
                        </Stack>

                        <AdPricePart price={adBuyerView?.adPrice} isSold={adBuyerView?.isAdSold} />
                    </>
                }
            >

            </CardHeader>
            <CardContent>
                <title>{adBuyerView?.adTitle}</title>
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

                            {adBuyerView?.adImages?.length === 0 ?
                                (
                                    <></>
                                ) :
                                (
                                    <div className="ad-view-images">
                                        <img onClick={() => loadImageFromClick(0)} className="ad-view-first-images ad-view-big-image imgFit" src={adBuyerView?.adImages[0]?.path} />

                                        <div className="ad-view-images-column">
                                            {adBuyerView?.adImages.slice(1, 3)?.map(
                                                (value, index) => (
                                                    value ?
                                                        (
                                                            <img key={createRandomKey()} onClick={() => loadImageFromClick(index + 1)} className="ad-view-first-images ad-view-images-column-element imgFit" src={value?.path} />
                                                        ) : (
                                                            <></>
                                                        )
                                                )
                                            )}

                                            {/* Last image terner */}
                                            {adBuyerView?.adImages.length > 4 ?
                                                (
                                                    // ad-view-zoomed-image
                                                    <p onClick={() => loadImageFromClick(3)} style={{ backgroundImage: `url(${adBuyerView?.adImages[3]?.path})` }} className="ad-view-images-zoom-in ad-view-first-images ad-view-images-column-element imgFit">+{adBuyerView?.adImages.length - 4}</p>
                                                ) : (
                                                    adBuyerView?.adImages.length === 4 ?
                                                        <img onClick={() => loadImageFromClick(3)} src={adBuyerView?.adImages[3]?.path} className="ad-view-first-images ad-view-images-column-element imgFit" />
                                                        :
                                                        <></>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <br />

                            {/* AdTags */}
                            {adBuyerView?.adTagsName?.map(value => (
                                <AdTagPart key={createRandomKey()} label={value} isAdView />
                            ))}

                            <div className="ad-view-flex-desc-infos">
                                <p className="ad-view-description">{adBuyerView?.adDescription}</p>
                                <AdInfosPart
                                    location={adBuyerView?.adAddress}
                                    phone={adBuyerView?.userPhone}
                                    publishDate={adBuyerView?.adAddedDate}
                                    shape={adBuyerView?.adShape} />
                            </div>
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