import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import "../../css/component/page/LoadingIcon.css"
const LoadingIcon = () : ReactElement => {
    return (
        <div id="loadingIcon">
            <img  src="./img/loadingAnim.svg" />
        </div>
        
    );
}

export default LoadingIcon;