import { faEnvelope, faPencil, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/component/page/UserProfil.css";
import { CustomerDto } from "../../entities/dto/CustomerDto";
import CustomerProfil from "../../entities/dto/CustomerProfil";
import { getCustomerProfil } from "../../services/CustomerInfo";
import AdPreview from "./AdPreview";

const noProfilIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png" ;

export default function UserProfil(props: {customerDto: CustomerDto}): ReactElement {
    const { link } = useParams();
    const [customerProfil, setCustomerProfil] = useState<CustomerProfil>();

    useEffect(() => {
        getCustomerProfil(link).then(res => {
            setCustomerProfil(res?.data)
        });
    }, []);

    console.log(customerProfil)
    return (
        <div className="main-background">
            <div className="front-div">
                {props.customerDto?.link == link ?
                    (
                        <Link to="/u/customer-modification"><FontAwesomeIcon className="pencil" icon={faPencil} /></Link>
                    ) : (
                        <></>
                    )
                }

                <div className="top-div">
                    <div className="pfp-div">
                        <img className="pfp" src={customerProfil?.customerInfo?.iconPath ? customerProfil?.customerInfo?.iconPath : noProfilIcon}></img>
                    </div>
                    <div className="info-div">
                        <div style={{ fontWeight: "bold", fontSize: "1.25vw", marginBottom: "1vh" }}>{customerProfil?.username} <span style={{ color: "#D3D3D3", fontSize: "0.5vw", fontWeight: "lighter" }}>Since {customerProfil?.joinedDate?.split("-")[0]}</span></div>
                        {customerProfil?.customerInfo?.phoneNumber ?
                            (
                                <div className="user-infos"><p><FontAwesomeIcon icon={faPhone} />  {customerProfil?.customerInfo?.phoneNumber}</p></div>
                            ) : (
                                <></>
                            )
                        }

                        {customerProfil?.customerInfo?.exposedEmail ?
                            (
                                <div className="user-infos"><p><FontAwesomeIcon icon={faEnvelope} />  {customerProfil?.customerInfo?.exposedEmail}</p></div>
                            ) : (
                                <></>
                            )
                        }
                        <p>{customerProfil?.customerInfo?.bio}</p>
                    </div>
                </div>
                <div className="profile-sep"></div>
                <div className="bottom-div" style={{ overflowY: "scroll", height: "400px" }}>
                    <div className="user-ads">
                        {(customerProfil?.ads?.length > 0) ? customerProfil?.ads?.map((data: AdSearchPreview, i: number) => {
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