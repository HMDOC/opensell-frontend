import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdByLink } from "../../services/AdService";
import content from "../../locales/ad.json";
import { getLanguage } from "../../i18n/i18n";
import ProfilIcon from "./ProfilIcon";
import { AxiosResponse } from "axios";
import { AdBuyerView, AdShape, AdVisibility } from "../../entities/dto/AdBuyerView";
import AdPricePart from "../part/AdView/AdPricePart";
import AdTypePart from "../part/AdView/AdTypePart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLink, faLock } from "@fortawesome/free-solid-svg-icons";
import AdTagPart from "../part/AdView/AdTagPart";
import AdInfosPart from "../part/AdView/AdInfosPart";
import "../../css/component/part/ImageFit.css";
import { Img } from "react-image";

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

export function AdVisibilityPart(props: { adVisibility?: AdVisibility }): ReactElement {
    switch (props.adVisibility) {
        case AdVisibility.LINK_ONLY:
            return <FontAwesomeIcon size="2x" icon={faLink} />;
        case AdVisibility.PRIVATE:
            return <FontAwesomeIcon size="2x" icon={faLock} />;
        default:
            // ONLY HERE FOR DEMO
            return <FontAwesomeIcon size="2x" icon={faEarthAmericas} />;
    }
}

/*
# old code : for changing image

{adBuyerView?.adImages?.length == 0 ?
    <></> :
    <div className="image-div">
        <img className="first-image-of-list" src={adBuyerView?.adImages?.[currentPicture]?.path} />

        <div style={{ display: "flex" }}>
            <button onClick={() => nextOrPrevious(false)}>previous</button>
            <p>{currentPicture + 1} / {adBuyerView?.adImages?.length}</p>
            <button onClick={() => nextOrPrevious(true)}>next</button>
        </div>
    </div>
}
*/

export function AdMapping(props: { request: Promise<AxiosResponse<AdBuyerView, any>>, children?: any }) {
    const [currentPicture, setCurrentPicture] = useState<number>(0);
    const [adBuyerView, setAdBuyerView] = useState<AdBuyerView>(undefined);

    useEffect(() => {
        props.request.then(res => {
            if (res?.data) {
                setAdBuyerView(res?.data);
                console.log(res?.data);
            }
        });
    }, []);

    const nextOrPrevious = (isNext: boolean) => {
        let newIndex = changePicture(isNext, currentPicture, adBuyerView?.adImages?.length);
        if (newIndex != currentPicture) {
            setCurrentPicture(newIndex);
        }
    };

    return (
        <div className="ad-view-background">
            {adBuyerView ?
                (
                    <>
                        <div className="user-profil">
                            <Link to={`/user/${adBuyerView?.userLink}`}>
                                <ProfilIcon src={adBuyerView?.userIcon} />
                            </Link>

                            <Link className="user-profil-username" to={`/user/${adBuyerView?.userLink}`}>
                                {adBuyerView?.username}
                            </Link>
                        </div>

                        <div className="ad-view-title-section">
                            <AdVisibilityPart adVisibility={adBuyerView?.adVisibility} />
                            <h1>{adBuyerView?.adTitle}</h1>
                            <AdTypePart type={adBuyerView?.adType?.name} />
                        </div>

                        <AdPricePart price={adBuyerView?.adPrice} isSold={adBuyerView?.isAdSold} />

                        {adBuyerView?.adImages?.length == 0 ?
                            (
                                <></>
                            ) :
                            (
                                <div className="ad-view-images">
                                    <img className="ad-view-big-image imgFit" src={adBuyerView?.adImages[0]?.path} />

                                    <div className="ad-view-images-column">
                                        {adBuyerView?.adImages.slice(1, 3)?.map(
                                            value => (
                                                value ?
                                                    (
                                                        <img className="ad-view-images-column-element imgFit" src={value?.path} />
                                                    ) : (
                                                        <></>
                                                    )
                                            )
                                        )}

                                        <div className="ad-view-images-column-element ad-view-images-zoom-in">
                                            <img src={adBuyerView?.adImages[0]?.path} className="ad-view-zoomed-image" />
                                            <p style={{position : "absolute"}}>+{adBuyerView?.adImages.length - 3}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <br />

                        {/* AdTags */}
                        {adBuyerView?.adTagsName?.map(value => (
                            <AdTagPart label={value} />
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
        </div>);
}

/**
 * Component for that will be shown when a buyer click on a ad.
 * 
 * @author Achraf
*/
const AdView = (): ReactElement => {
    const { link } = useParams();

    return (
        <div className="ad-view-position">
            <AdMapping request={getAdByLink(link)} />
        </div>
    );
}

export default AdView;