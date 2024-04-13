import { Component, ReactNode, useEffect, useState } from "react";
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

export default function PrivateRoute() {
    const [validationCase, setValidationCase] = useState<ValidationCase>(ValidationCase.IN_PROGRESS);

    useEffect(() => {
        let promise = getUserInfos("token");

        if (promise) {
            promise.then(res => {
                if (res?.data) {
                    setValidationCase(ValidationCase.VALID);
                } else {
                    localStorage.removeItem("token");
                    setValidationCase(ValidationCase.INVALID);
                }
            })
        } else {
            setValidationCase(ValidationCase.INVALID);
        }
    }, [])

    return (
        <>
            {validationCase == ValidationCase.IN_PROGRESS ?
                (
                    <>
                        <Loading />
                    </>
                ) : (
                    <>
                        {
                            validationCase == ValidationCase.VALID ? <Outlet /> : <Navigate to="/login" />
                        }
                    </>
                )
            }
        </>
    );
}