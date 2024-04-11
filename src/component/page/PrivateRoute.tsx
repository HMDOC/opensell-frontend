import { Navigate, Outlet } from "react-router-dom";
import getUserInfos from "../../services/GetUser";
import { CustomerDto } from "../../entities/dto/CustomerDto";

export default function PrivateRoute(props: {customerDto: CustomerDto}) {
    console.log(props.customerDto);
    
    return (
        props.customerDto ? <Outlet /> : <Navigate to="/login" />
    )
}