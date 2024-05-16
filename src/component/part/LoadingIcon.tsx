import { ReactElement } from "react";
import "../../css/component/page/LoadingIcon.css"
const LoadingIcon = (props) : ReactElement => {
    return (
        <div id="loadingIcon">
        <title>Loading...</title>
            <img className="loadingIcon" src={(props.isLazy) ? "/img/lazyLoadAnim.svg" : "/img/loadingAnim.svg"} />
        </div>
        
    );
}

export default LoadingIcon;