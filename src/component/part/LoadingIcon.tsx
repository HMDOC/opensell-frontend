import { ReactElement } from "react";
import "../../css/component/page/LoadingIcon.css"
const LoadingIcon = (props) : ReactElement => {
    return (
        <div id="loadingIcon">
            <img className="loadingIcon" src={(props.isLazy) ? "/img/lazyLoadAnim.svg" : "/img/loadingAnim.svg"} />
        </div>
        
    );
}

export default LoadingIcon;