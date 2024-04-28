import { Component, ReactElement, ReactNode, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getCustomerInfo, getPublicUserAds } from "../../services/CustomerInfo";
import { CustomerInfo } from "../../entities/dto/CustomerInfo";
import AdPreview from "./AdPreview";
import "../../css/component/page/UserProfil.css"
import { CustomerDto } from "../../entities/dto/CustomerDto";
import { getDto } from "../../services/LogInService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLocationDot, faPencil, faPhone } from "@fortawesome/free-solid-svg-icons";

export default function UserProfil(): ReactElement {
    const { link } = useParams();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();
    const [customerDto, setCustomerDto] = useState<CustomerDto>();
    const [publicUserAds, setPublicUserAds] = useState<AdSearchPreview[]>([]);;
    useState(() => {
        getCustomerInfo(link).then(res => {
            setCustomerInfo(res?.data)
        })
        getPublicUserAds(link).then(res => {
            setPublicUserAds(res?.data)
        })
    });
    useEffect(() => {
        if (customerDto == undefined) {
            getDto(customerInfo?.idCustomerInfo).then((res) => {
                setCustomerDto(res?.data);
            });
        }
    });
    let year = customerDto?.joinedDate.split("-")[0];
    return (
        <div className="back-div">
            <div className="front-div">
                {customerDto?.link == link ? (
                    <NavLink to="/u/customer-modification"><FontAwesomeIcon className="pencil" icon={faPencil} /></NavLink>

                ) : ""}
                <div className="top-div">
                    <div className="pfp-div">
                        <img className="pfp" src={customerInfo?.iconPath == undefined ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png" : customerInfo?.iconPath}></img>
                    </div>
                    <div className="info-div">
                        <div style={{ fontWeight: "bold", fontSize: "1.25vw", marginBottom: "1vh" }}>{customerInfo?.firstName} {customerInfo?.lastName} <span style={{ color: "#D3D3D3", fontSize: "0.5vw", fontWeight: "lighter" }}>Since {year}</span></div>
                        &nbsp;<div className="user-infos"><p><FontAwesomeIcon icon={faLocationDot} />  Montreal</p></div>
                        <div className="user-infos"><p><FontAwesomeIcon icon={faPhone} />  {customerInfo?.phoneNumber}</p></div>
                        <div className="user-infos"><p><FontAwesomeIcon icon={faEnvelope} />  {customerInfo?.exposedEmail}</p></div>
                        <p>{customerInfo?.bio}</p>
                    </div>
                </div>
                <div className="profile-sep"></div>
                <div className="bottom-div" style={{ overflowY: "scroll", height: "400px" }}>
                    <div className="user-ads">
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
                </div>

            </div>
        </div>
    );
}