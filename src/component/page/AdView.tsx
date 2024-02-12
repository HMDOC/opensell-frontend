import { ReactElement, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdByLink } from "../../services/AdRequest";
import content from "../../locales/ad.json";
import { getLanguage } from "../../i18n/i18n";

export const AdView = (): ReactElement => {
    const { link } = useParams();
    const navigate = useNavigate();
    const [adBuyerView, setAdBuyerView] = useState<AdBuyerView>();
    var map = getLanguage(0, content);

    useEffect(() => {
        getAdByLink(link).then(res => {
            setAdBuyerView(res?.data);
            console.log(res?.data)
        });
    }, []);

    console.log();
    return(
        <>
            <div>
                <h1>{adBuyerView?.adTitle}</h1>
                <p>{adBuyerView?.adPrice} $</p>
                <p>{adBuyerView?.isAdSold ? map.sold : ""}</p>
                <p>{map.adShape[adBuyerView?.adShape]}</p>

            </div>

            <div style={{backgroundColor : "red"}}>
                <p>UserInfo: </p>

                <Link style={{display : "flex"}} to={`/user/${adBuyerView?.userLink}`}>
                    <p>{adBuyerView?.username}</p>
                    <img src={adBuyerView?.userIcon} />
                </Link>
            </div>
        </>
    );
}