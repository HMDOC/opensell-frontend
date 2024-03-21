import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdByLink } from "../../services/AdService";
import content from "../../locales/ad.json";
import { getLanguage } from "../../i18n/i18n";
import Loading from "../part/Loading";

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
const AdView = (): ReactElement => {
    const { link } = useParams();
    const [adBuyerView, setAdBuyerView] = useState<AdBuyerView>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    var map = getLanguage(1, content);
    const [currentPicture, setCurrentPicture] = useState<number>(0);

    useEffect(() => {
        getAdByLink(link).then(res => {
            if (res?.data) {
                setAdBuyerView(res?.data);
            }

            setIsLoading(false);
        });
    }, []);

    const nextOrPrevious = (isNext: boolean) => {
        let newIndex = changePicture(isNext, currentPicture, adBuyerView?.adImagesPath?.length);
        if (newIndex != currentPicture) {
            setCurrentPicture(newIndex);
        }
    };

    return (
        <>
            {isLoading ?
                (
                    <Loading />
                ) : (
                    adBuyerView ?
                        (
                            <>
                                <div>
                                    <h1>{adBuyerView?.adTitle}</h1>
                                    {/* Image Section */}
                                    <img className="first-image-of-list" src={adBuyerView?.adImagesPath?.[currentPicture]} />

                                    <div style={{ display: "flex" }}>
                                        <button onClick={() => nextOrPrevious(false)}>previous</button>
                                        <p>{currentPicture + 1} / {adBuyerView?.adImagesPath?.length}</p>
                                        <button onClick={() => nextOrPrevious(true)}>next</button>
                                    </div>

                                    <p>{adBuyerView?.adPrice} $</p>
                                    <p>{adBuyerView?.isAdSold ? map.sold : ""}</p>
                                    <p><b>AdShape : </b> {map.shape[adBuyerView?.adShape]}</p>
                                    <p><b>AdVisibility : </b>{map.visibility[adBuyerView?.adVisibility]}</p>

                                    <h2>Description: </h2>
                                    <p>{adBuyerView?.adDescription}</p>
                                    <p><b>Added Date : </b>{adBuyerView?.adAddedDate?.toString()}</p>
                                    <p><b>Address : </b>{adBuyerView?.adAddress}</p>
                                    <p><b>Type : </b>{adBuyerView?.adTypeName}</p>

                                    <h2>Tags: </h2>
                                    {adBuyerView?.adTagsName?.map(value => (
                                        <p>
                                            {value}
                                        </p>
                                    ))}
                                </div>

                                <h2>UserProfil: </h2>
                                <div className="user-profil">
                                    <Link to={`/user/${adBuyerView?.userLink}`}>
                                        <img className="user-profil-picture" src={adBuyerView?.userIcon} />
                                    </Link>

                                    <Link className="user-profil-username" to={`/user/${adBuyerView?.userLink}`}>
                                        {adBuyerView?.username}
                                    </Link>
                                </div>

                            </>
                        ) : (
                            <>
                                <p>The ad does not exists.</p>
                                <Link to="/">Main menu</Link>
                            </>
                        )
                )
            }

        </>
    );
}

export default AdView;