import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/component/page/AdPreview.css"

const AdPreview = (props) : ReactElement => {

    //const query = useRef();
    const adNav = useNavigate();

    const gotoAd = () => {
        adNav(`/ad/${props?.link}`);
    }

    return (
        <div id={props?.link} className="adPreview" onClick={gotoAd} >
            <img className="card-img-top" src={props?.firstImagePath} alt="The image cant load!"></img>
            <h3 className="adPreviewText">{props?.title}</h3>
            <h4 className="adPreviewText">{props?.isSold ? "sold" : props?.price+"$"}</h4>
            <h5 className="adPreviewText">{props?.shape}</h5>
        </div>
    )
}

export default AdPreview;