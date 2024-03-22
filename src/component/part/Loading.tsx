import { Component, ReactNode } from "react";
import LoadingIcon from "../part/LoadingIcon"; 

export default class Loading extends Component {
    public render(): ReactNode {
        return(
            <>
                <p> Loading... </p>
                <LoadingIcon/>
            </>
        );
    }

}