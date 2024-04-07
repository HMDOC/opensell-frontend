import { Navigate, Outlet } from "react-router-dom";
import getUserInfos from "../../services/GetUser";

export default function PrivateRoute() {
    const customerInfo = getUserInfos('token');
    return (
        customerInfo ? <Outlet /> : <Navigate to="/login" />
    )
}