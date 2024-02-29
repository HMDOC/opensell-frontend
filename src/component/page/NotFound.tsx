import { Component, ReactNode } from "react";

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return(
            <>
                <div>404 Not-Found</div>
                <a href="/">Go back home</a>
            </>
        );
    }
}