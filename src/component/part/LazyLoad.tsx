import { Component, ReactNode } from "react";
import LoadingIcon from "./LoadingIcon"; 

export default class LazyLoad extends Component {
    public render(): ReactNode {
        return(
            <>
                <LoadingIcon isLazy={1}/>
            </>
        );
    }

}