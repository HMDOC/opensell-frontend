import { faLink, faLock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import { ReactElement, useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useParams } from "react-router-dom";
import "../../css/component/page/AdView.scss";
import "../../css/component/part/ImageFit.css";
import { AdBuyerView, AdVisibility } from "../../entities/dto/AdBuyerView";
import { getAdByLink } from "../../services/AdService";
import AdInfosPart from "../part/AdView/AdInfosPart";
import AdPricePart from "../part/AdView/AdPricePart";
import AdTagPart from "../part/AdView/AdTagPart";
import AdTypePart from "../part/AdView/AdTypePart";
import ProfilIcon from "./ProfilIcon";
import { createRandomKey } from "../../services/RandomKeys";


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
    return (props.adVisibility && props.adVisibility != null ?
        (
            <FontAwesomeIcon
                style={{ fontSize: "35px", marginBottom: "10px" }}
                icon={
                    props.adVisibility == AdVisibility.LINK_ONLY ?
                        (faLink) : (
                            props.adVisibility == AdVisibility.PRIVATE ?
                                (faLock) : (null)
                        )
                }
            />
        ) : (
            <></>
        )
    );
}

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
        if (newIndex != currentPicture) {
            setCurrentPicture(newIndex);
        }
    };

    const loadImageFromClick = (pictureIndex: number) => {
        if (currentPicture != pictureIndex) {
            setCurrentPicture(pictureIndex);
        }

        setIsPicturePopup(true);
    };

    return (
        <div className="ad-view-position">
            <div style={{ maxWidth: "1400px", overflowY : 'scroll', height: "90vh" }} className="reg-background">
                {adBuyerView ?
                    (
                        <>
                            <div className="user-profil dark-shadow">
                                <Link className="icon-ad" to={`/user/${adBuyerView?.userLink}`}>
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

                            {/* Images Popup */}
                            <Modal
                                isOpen={isPicturePopup}
                                shouldCloseOnEsc
                                style={{
                                    content: {
                                        backgroundColor: "white",
                                        color: "var(--dark-mode-text)",
                                    }
                                }}
                                onRequestClose={() => setIsPicturePopup(false)}>
                                <>
                                    <FontAwesomeIcon color="black" style={{ cursor: "pointer" }} onClick={() => setIsPicturePopup(false)} size="2x" icon={faXmark} />
                                    <div className="ad-view-popup-section">
                                        <img className="ad-view-popup-image imgFit" src={adBuyerView?.adImages?.[currentPicture]?.path} />

                                        <div className="ad-view-popup-controls">
                                            <button className="ad-view-popup-image-change-btn" onClick={() => nextOrPrevious(false)}>
                                                <img style={{ rotate: "180deg" }} src="/img/prev-img.webp"></img>
                                            </button>

                                            <p className="ad-view-popup-image-count">{currentPicture + 1} / {adBuyerView?.adImages?.length}</p>

                                            <button className="ad-view-popup-image-change-btn" onClick={() => nextOrPrevious(true)}>
                                                <img src="/img/prev-img.webp"></img>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            </Modal>

                            <AdPricePart price={adBuyerView?.adPrice} isSold={adBuyerView?.isAdSold} />

                            {adBuyerView?.adImages?.length == 0 ?
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
                                                    <div className="ad-view-first-images ad-view-images-column-element ad-view-images-zoom-in">
                                                        <img onClick={() => loadImageFromClick(3)} src={adBuyerView?.adImages[3]?.path} className="ad-view-zoomed-image" />
                                                        <p style={{ position: "absolute" }}>+{adBuyerView?.adImages.length - 4}</p>
                                                    </div>
                                                ) : (
                                                    adBuyerView?.adImages.length == 4 ?
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
            </div>
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
        <AdMapping request={getAdByLink(link)} />
    );
}

export default AdView;