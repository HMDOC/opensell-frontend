import { Component, ReactNode } from "react";
import "./style.css";

export const LoadingIcon = (props: {isLazy?: boolean}) => {
    return (
        <div id="loadingIcon">
        <title>Loading...</title>
            <img className="loadingIcon" src={(props.isLazy) ? "/img/lazyLoadAnim.svg" : "/img/loadingAnim.svg"} />
        </div>
        
    );
}

export class LazyLoad extends Component {
    public render(): ReactNode {
        return(
            <>
                <LoadingIcon isLazy />
            </>
        );
    }
}

export class Loading extends Component {
    public render(): ReactNode {
        return(
            <>
                <p> Loading... </p>
                <LoadingIcon/>
            </>
        );
    }

}