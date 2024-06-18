import { ReactElement } from "react";
import "./style.css"
import AdPricePart from "../../../../components/shared/part/AdView/AdPricePart";

/** 
    The preview component for the Ads. Clicking on it will
    @author Davide
*/
const AdPreview = (props): ReactElement => {

    const gotoAd = () => {
        //adNav(`/ad/${props?.link}`, {state : 0});
        window.open(`/ad/${props?.link}`, "_blank", "noreferrer");
    }

    const addSoldCSS = (style: string) => {
        return (props?.isSold ? style : "");
    }

    return (
        <div id={props?.link} className={"adPreview " + addSoldCSS("adSold")} onClick={gotoAd} >
            <img style={{ width: "100%", height: "11em" }} className="card-img-top imgFit imgOffset"
                src={props?.firstImagePath}
                alt="The image cant load!" />
            <div className="adPreviewBottom">
                <h3 className="adPreviewText"> {props?.title}</h3>
                <div className="adPreviewAlign">
                    <AdPricePart price={props?.price} isSold={props?.isSold} />
                </div>
            </div>

        </div>
    )
}

export default AdPreview;