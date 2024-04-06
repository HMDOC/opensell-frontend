import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdByLink } from "../../services/AdService";
import content from "../../locales/ad.json";
import { getLanguage } from "../../i18n/i18n";
import Loading from "../part/Loading";
import ProfilIcon from "./ProfilIcon";
import { AxiosPromise, AxiosResponse } from "axios";
import { AdBuyerView } from "../../entities/dto/AdBuyerView";

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

export function AdMapping(props: {request: Promise<AxiosResponse<AdBuyerView, any>>, children?: any}) {
    var map = getLanguage(1, content);
    const [currentPicture, setCurrentPicture] = useState<number>(0);
    const [adBuyerView, setAdBuyerView] = useState<AdBuyerView>(undefined);

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

    return (
        adBuyerView ?
        (
            <div>
                <div>
                    <h1>{adBuyerView?.adTitle}</h1>
                    {/* Image Section */}
                    <img className="first-image-of-list" src={adBuyerView?.adImages?.[currentPicture].path} />

                    <div style={{ display: "flex" }}>
                        <button onClick={() => nextOrPrevious(false)}>previous</button>
                        <p>{currentPicture + 1} / {adBuyerView?.adImages?.length}</p>
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
                    <p><b>Type : </b>{adBuyerView?.adType?.name}</p>

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
                        <ProfilIcon src={adBuyerView?.userIcon} />
                    </Link>

                    <Link className="user-profil-username" to={`/user/${adBuyerView?.userLink}`}>
                        {adBuyerView?.username}
                    </Link>
                </div>
            </div>
        ) : (
            <div className="main-background">
                <p>The ad does not exists.</p>
                <Link to="/">Main menu</Link>
            </div>
        ));
}

/**
 * Component for that will be shown when a buyer click on a ad.
 * 
 * @author Achraf
*/
const AdView = (): ReactElement => {
    const { link } = useParams();

    return (
        <div className="main-background">
            <AdMapping request={getAdByLink(link)} />
        </div>
    );
}

export default AdView;