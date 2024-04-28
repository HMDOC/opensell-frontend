import { faEnvelope, faLocationDot, faPencil, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "../../css/component/page/UserProfil.css";
import { CustomerDto } from "../../entities/dto/CustomerDto";
import { CustomerInfo } from "../../entities/dto/CustomerInfo";
import { getCustomerInfo, getPublicUserAds } from "../../services/CustomerInfo";
import getUserInfos from "../../services/GetUser";
import AdPreview from "./AdPreview";

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
        getUserInfos("token")?.then((res) => {
            if (res?.data) {
                setCustomerDto(res?.data);
            }
        });
    });

    console.log("Date : "+customerDto?.joinedDate);
    let year = "";
    console.log(customerDto?.link);
    return (
        <div className="back-div">
            <div className="front-div">
                {customerDto?.link == link ? (
                    <NavLink to="/u/customer-modification"><FontAwesomeIcon className="pencil" icon={faPencil} /></NavLink>

                ) : ""}
                <div className="top-div">
                    <div className="pfp-div">
                        <img className="pfp" src={customerInfo?.iconPath}></img>
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