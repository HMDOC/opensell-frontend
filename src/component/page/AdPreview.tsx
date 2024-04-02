import { ReactElement } from "react";
import "../../css/component/page/AdPreview.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxOpen, faDizzy, faEarthAmerica, faFaceGrin, faFaceMeh, faFaceSmile, faFaceSmileBeam, faFrown, faGrinStars, faQuestion, faStar, faStarHalf, faStarHalfStroke, faWandMagic, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

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

    const getShapeIcon = (shape:number) => {
        return (
            <FontAwesomeIcon icon={shapeIconList[shape]}/>
        )
    }

    const getShapeName = (shape:number) => {
        return shapeTextList[shape]
    }

    return (
        <div id={props?.link} className={"adPreview " + addSoldCSS("adSold")} onClick={gotoAd} >
            <img className="card-img-top" src={props?.firstImagePath} alt="The image cant load!"></img>
            <hr />
            <h3 className="adPreviewText"> {props?.title}</h3>
            <div className="adPreviewAlign">
                <h4 className={"adPreviewText " + addSoldCSS("adSoldText")}>{props?.isSold ? "sold" : props?.price+"$"}</h4>
                <h3 className="adPreviewText adShapeIcon" title={getShapeName(props?.shape)}> {getShapeIcon(props?.shape)}</h3>
            </div>
        </div>
    )
}

export default AdPreview;