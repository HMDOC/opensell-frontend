import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import getUserInfos from "../../services/GetUser";
import Loading from "@shared/part/Loading";
import { AppContext } from "../../context/AppContext";

enum ValidationCase {
    VALID,
    INVALID,
    IN_PROGRESS
}

export default function PrivateRoute() {
    const { getCustomerInfo, customerDto } = useContext(AppContext);
    const [validationCase, setValidationCase] = useState<ValidationCase>(ValidationCase.IN_PROGRESS);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("NAVIGATED")
        let promise = getUserInfos("token");
        
        if (promise) {
            promise.then(async (res) => {
                if (res?.data) {
                    setValidationCase(ValidationCase.VALID);
                } else {
                    localStorage.removeItem("token");
                    await getCustomerInfo();
                    setValidationCase(ValidationCase.INVALID);
                }
            })
        } else {
            setValidationCase(ValidationCase.INVALID);
        }
    }, [navigate]);

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
                            validationCase == ValidationCase.VALID ? <Outlet /> : <Navigate to="/login" replace />
                        }
                    </>
                )
            }
        </>
    );
}