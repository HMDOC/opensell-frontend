import { Component, ReactNode } from "react";
import GlobalNavBar from "./GlobalNavBar.js";

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return (
            <>
                <GlobalNavBar />
                <div>404 Not-Found</div>
                <a href="/">Go back home</a>
            </>
        );
    }
}