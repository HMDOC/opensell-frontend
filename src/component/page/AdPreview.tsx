import { ReactElement } from "react";
import "../../css/component/page/AdPreview.css"

const AdPreview = (props) : ReactElement => {

    //const query = useRef();

    return (
        <div id={props?.link} className="adPreview" >
            <img className="card-img-top" src={props?.firstImagePath} alt="The image cant load!"></img>
            <h3 className="adTxt">{props?.title}</h3>
            <h4 className="adTxt">{props?.isSold ? "sold" : props?.price+"$"}</h4>
            <h5 className="adTxt">{props?.shape}</h5>
        </div>
    )
}

export default AdPreview;