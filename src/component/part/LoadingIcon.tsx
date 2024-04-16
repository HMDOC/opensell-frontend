import { ReactElement } from "react";
import "../../css/component/page/LoadingIconPrevious.css"
const LoadingIcon = () : ReactElement => {
    return (
        <div id="loadingIcon">
            <img className="loadingIcon" src="/img/loadingAnim.svg" />
        </div>
        
    );
}

export default LoadingIcon;