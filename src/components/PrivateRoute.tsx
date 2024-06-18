import { Loading } from "@animations/loading";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import getUserInfos from "../services/GetUser";

export default function PrivateRoute() {
    const { logout } = useContext(AppContext);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        console.log("NAVIGATED")
        let promise = getUserInfos("token");

        if (!promise) setIsLoading(false);

        promise?.then(async (res) => {
            if (res?.data) {
                setIsLogin(true);
                setIsLoading(false);
            } else {
                setIsLogin(false);
                localStorage.removeItem("token");
                logout();
                setIsLoading(false);
            }
        })
    }, [navigate]);

    return (
        <>
            {isLoading ?
                (
                    <Loading />
                ) : (
                    isLogin ? <Outlet /> : <Navigate to="/login" replace />
                )
            }
        </>
    );
}