import { ReactElement } from "react";

/*
    THIS IS UNFINISHED
*/

const AdPreview = (props) : ReactElement => {

    //const query = useRef();

    return (
        <div id={props?.link}>
            Yes, this is an ad.
            <img src={props?.firstImagePath} alt="The image cant load!"></img>
            <h3>{props?.title}</h3>
            <h5>{props?.price}</h5>
            <h5>{props?.shape}</h5>
            <p>{props?.isSold}</p>
        </div>
    )
}

export default AdPreview;