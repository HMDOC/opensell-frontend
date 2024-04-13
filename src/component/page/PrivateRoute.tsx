import { Component, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import getUserInfos from "../../services/GetUser";
import Loading from "../part/Loading";

enum ValidationCase {
    VALID,
    INVALID,
    IN_PROGRESS
}

interface PrivateRouteState {
    isResolved: ValidationCase;
}

export default class PrivateRoute extends Component<any, PrivateRouteState> {
    public state: Readonly<PrivateRouteState> = {
        isResolved: ValidationCase.IN_PROGRESS,
    };

    public componentDidMount(): void {
        let promise = getUserInfos("token");
        
        if(promise) {
            promise.then(res => {
                if (res?.data) {
                    this.setState({ isResolved : ValidationCase.VALID });
                } else {
                    localStorage.removeItem("token");
                    this.setState({ isResolved : ValidationCase.INVALID });
                }
            })
        } 
        
        else {
            this.setState({ isResolved : ValidationCase.INVALID });
        }
    }

    public render(): ReactNode {
        return (
            <>
                {this.state.isResolved == ValidationCase.IN_PROGRESS ?
                    (
                        <>
                            <Loading />
                        </>
                    ) : (
                        <>
                            {
                                this.state.isResolved == ValidationCase.VALID ? <Outlet /> : <Navigate to="/login" />
                            }
                        </>
                    )
                }
            </>
        );
    }
}