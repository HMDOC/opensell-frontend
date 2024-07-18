import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfilIcon from "../../components/shared/ProfilIcon";
import CustomerProfil from "../../entities/dto/CustomerProfil";
import { getCustomerProfil } from "../../services/CustomerInfo";
import AdPreview from "../catalog/components/ad-preview";
import "./style.css";
import EmailIcon from '@mui/icons-material/Email';

export default function UserProfil(props: { loggedUserLink?: string, isMyProfil?: boolean }): ReactElement {
    const { link } = useParams();
    const [customerProfil, setCustomerProfil] = useState<CustomerProfil>();

    useEffect(() => {
        getCustomerProfil(props.isMyProfil ? props.loggedUserLink : link).then(res => {
            setCustomerProfil(res?.data)
        });
    }, []);

    console.log(customerProfil)
    return (
        <div className="main-background">
            <title>{customerProfil?.username}</title>
            <div className="front-div">
                {props.isMyProfil ?
                    (
                        <Link to="/u/setting"><EditIcon className="pencil" /></Link>
                    ) : (
                        <></>
                    )
                }

                <div className="top-div">
                    <div className="pfp-div">
                        <ProfilIcon src={customerProfil?.customerInfo?.iconPath} username={customerProfil?.username} />
                    </div>
                    <div className="info-div">
                        <div style={{ fontWeight: "bold", fontSize: "1.25vw", marginBottom: "1vh" }}>{customerProfil?.username} <span style={{ color: "#D3D3D3", fontSize: "0.5vw", fontWeight: "lighter" }}>Since {customerProfil?.joinedDate?.split("-")[0]}</span></div>
                        {customerProfil?.customerInfo?.phoneNumber ?
                            (
                                <div className="user-infos"><p><PhoneIcon />  {customerProfil?.customerInfo?.phoneNumber}</p></div>
                            ) : (
                                <></>
                            )
                        }

                        {customerProfil?.customerInfo?.exposedEmail ?
                            (
                                <div className="user-infos"><p><EmailIcon />  {customerProfil?.customerInfo?.exposedEmail}</p></div>
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