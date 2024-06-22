import { Loading } from "@animations/loading";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import getUserInfos from "../services/GetUser";

export default function PrivateRoute() {
    const { logout } = useContext(AppContext);
    const [isOutlet, setIsOutlet] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        // If the token does not exists logout and go to Outlet.
        if(!localStorage.getItem("token")) {
            logout();
            setIsOutlet(false);
            setIsLoading(false);
            return;
        }

        // If the token is valid
        getUserInfos("token")?.then((res) => {
            if (res?.data) {
                setIsLoading(false);
                setIsOutlet(true);
            } else {
                localStorage.removeItem("token");
                logout();
                setIsLoading(false);
                setIsOutlet(false);
            }
        })
    }, [navigate]);

    return (
        <>
            {isLoading ?
                (
                    <Loading />
                ) : (
                    isOutlet ? <Outlet /> : <Navigate to="/login" replace />
                )
            }
        </>
    );
}