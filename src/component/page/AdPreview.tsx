import { ReactElement } from "react";
import "../../css/component/page/AdPreview.css"
import "../../css/component/part/ImageFit.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxOpen, faDizzy, faEarthAmerica, faFaceGrin, faFaceMeh, faFaceSmile, faFaceSmileBeam, faFrown, faGrinStars, faQuestion, faStar, faStarHalf, faStarHalfStroke, faWandMagic, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import AdPricePart from "../part/AdView/AdPricePart";

/** 
    The preview component for the Ads. Clicking on it will
    @author Davide
*/
const AdPreview = (props) : ReactElement => {


    const shapeIconList = [ 
        faStar,
        faFaceSmileBeam, 
        faFaceSmile,
        faFaceMeh,
        faFrown,
        faDizzy
    ];

    const shapeTextList = [
        "Brand New", 
        "Opened", 
        "Barely Used", 
        "Used", 
        "Bad", 
        "Unknown"
    ]

    const gotoAd = () => {
        //adNav(`/ad/${props?.link}`, {state : 0});
        window.open(`/ad/${props?.link}`, "_blank", "noreferrer");
    }

    const addSoldCSS = (style: string) => {
        return (props?.isSold ? style : "");
    }

    const getShapeIcon = () => {
        return (
            <FontAwesomeIcon icon={shapeIconList[props?.shape]}/>
        )
    }

    const getShapeName = () => {
        return shapeTextList[props?.shape]
    }

    const showPrice = () =>{
        return `${props?.price.toFixed(2)}$`;
    }

    return (
        <div id={props?.link} className={"adPreview " + addSoldCSS("adSold")} onClick={gotoAd} >
            <img className="card-img-top imgFit imgOffset" 
                src={props?.firstImagePath} 
                alt="The image cant load!"/>
            <div className="adPreviewBottom">
                <h3 className="adPreviewText"> {props?.title}</h3>
                <div className="adPreviewAlign">
                    <AdPricePart price={props?.price} isSold={props?.isSold}/>
                    <h3 className="adPreviewText adShapeIcon" 
                        title={getShapeName()} hidden> 

                        {getShapeIcon()}
                    </h3>
                </div>
            </div>
            
        </div>
    )
}

export default AdPreview;