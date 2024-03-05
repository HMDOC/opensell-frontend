import { Component, ReactElement, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCustomerInfo } from "../../services/CustomerInfo";
import { CustomerInfoView } from "../dto/CustomerInfo";

export default function UserProfil(): ReactElement {
    const { link } = useParams();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfoView>();
    useState(() => {
        getCustomerInfo(link).then(res => {
            setCustomerInfo(res?.data)
        })
    });
    return(
        <>
            <img width="125px" height="125px" style={{borderRadius: 100}} src={customerInfo?.iconPath}></img>
            <p>{customerInfo?.firstName} {customerInfo?.lastName}</p>
            <p>{customerInfo?.phoneNumber}</p>
            <p>{customerInfo?.primaryAddress}</p>
            <p>{customerInfo?.exposedEmail}</p>
            <p>{customerInfo?.bio}</p>
        </>
    );
}