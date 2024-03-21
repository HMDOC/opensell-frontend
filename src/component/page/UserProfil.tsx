import { Component, ReactElement, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCustomerInfo, getPublicUserAds } from "../../services/CustomerInfo";
import { CustomerInfoView } from "../dto/CustomerInfo";
import AdPreview from "./AdPreview";
import "../../css/component/page/Catalog.css"
import GlobalNavBar from "./GlobalNavBar.js";

export default function UserProfil(): ReactElement {
    const { link } = useParams();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfoView>();
    const [publicUserAds, setPublicUserAds] = useState<AdSearchPreview[]>([]);
    useEffect(() => {
        getCustomerInfo(link).then(res => {
            setCustomerInfo(res?.data)
        })
        getPublicUserAds(link).then(res => {
            setPublicUserAds(res?.data)
        })
    }, []);
    return (
        <>
            <GlobalNavBar />
            <img width="125px" height="125px" style={{ borderRadius: 100 }} src={customerInfo?.iconPath}></img>
            <p>{customerInfo?.firstName} {customerInfo?.lastName}</p>
            <p>{customerInfo?.phoneNumber}</p>
            <p>{customerInfo?.primaryAddress}</p>
            <p>{customerInfo?.exposedEmail}</p>
            <p>{customerInfo?.bio}</p>
            <h3>Posted ads</h3>
            <div id="searchResult">
                {(publicUserAds.length > 0) ? publicUserAds.map((data: AdSearchPreview, i: number) => {
                    return (
                        <AdPreview
                            key={`ad-preview-${i}`}
                            link={data?.adLink}
                            price={data?.adPrice}
                            shape={data?.adShape}
                            title={data?.adTitle}
                            isSold={data?.isAdSold}
                            firstImagePath={data?.adFirstImagePath}
                        />
                    )
                }) : <div className="searchEmpty">No ads posted, yet</div>}
            </div>

        </>
    );
}