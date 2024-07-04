import { AdBuyerView } from "@entities/dto/AdBuyerView";
import { DisplayAdView } from "@entities/dto/DisplayAdView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdCreationModal from "@pages/ad-creation/";
import { AdMapping } from "@pages/ad-view";
import { getCustomerAdPreview, getCustomerAds } from "@services/AdService";
import { createRandomKey } from "@services/RandomKeys";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DisplayAd from "./components/display-ad";
import "./style.css";
import { useAppContext } from "@context/AppContext";

export default function MyAds() {
    const { customerDto } = useAppContext();

    const [displayAds, setDisplayAds] = useState<Array<DisplayAdView>>([]);
    const [isPreview, setIsPreview] = useState<boolean>(false);
    const [currentAdPreview, setCurrentAdPreview] = useState<Promise<AxiosResponse<AdBuyerView, any>>>();
    const [dialogState, setDialogState] = useState<{ open: boolean, adCreator?: AdCreator }>({ open: false });
    
    // To only get data when something as been added or updated.
    const [isGetData, setIsGetData] = useState(true);

    useEffect(() => {
        if (customerDto?.customerId && !dialogState.open && isGetData) {
            getCustomerAds(customerDto?.customerId)
                .then(res => {
                    if (res?.data) {
                        setDisplayAds(res?.data);
                    }
                })

            setIsGetData(false);
            console.log("Get data!");
        }
    }, [dialogState]);

    const onDelete = (idAd: number) => {
        setDisplayAds(displayAds.filter(ad => ad.idAd !== idAd));
    }

    const getCurrentPromise = (idAd: number) => {
        setCurrentAdPreview(getCustomerAdPreview(idAd));
        setIsPreview(true);
    }

    const launchUpdate = (adCreator: AdCreator) => {
        setDialogState({ open: true, adCreator });
    }

    const launchCreate = () => {
        setDialogState({ open: true });
    }

    const onClose = (isChange?: boolean) => {
        if(isChange) {
            setIsGetData(true);
        }

        setDialogState({ open: false });
    }

    return (
        <>
            {isPreview ?
                (
                    <>
                        <Button className="my-ads-go-back" onClick={() => setIsPreview(false)}>Go Back</Button>
                        <AdMapping request={currentAdPreview} />
                    </>
                ) : (
                    <div className="back-div">
                        <div className="display-header d-flex justify-content-between">
                            <h1 className="fs-1 text-black"> <b>My ads</b></h1>
                            <Button onClick={launchCreate}><FontAwesomeIcon icon={faPlus} /></Button>
                        </div>
                        {displayAds.length > 0 ? (
                            <>

                                <div style={{ overflowY: "scroll", height: "87.25vh" }} className="ads-view">
                                    {displayAds?.map(value => (
                                        <DisplayAd
                                            key={createRandomKey()}
                                            {...value}
                                            onDelete={(idAd) => onDelete(idAd)}
                                            seeAdPreview={(idAd) => getCurrentPromise(idAd)}
                                            launchUpdate={launchUpdate}
                                        />))}
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: "center" }} className="back-div">
                                <h4>You have no ads</h4>
                            </div>
                        )}
                    </div>
                )
            }
            <AdCreationModal onClose={onClose} {...dialogState} />
        </>
    );
}