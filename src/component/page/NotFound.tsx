import { Component, ReactNode } from "react";
import LoadingIcon from "../part/LoadingIcon"; 

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return(
            <div className="main-background">
                <p>404 Not-Found</p> 
                <a href="/home">{">"} Go back home {">"}</a>
                <LoadingIcon/>
            </div>
        );
    }
}