import "./style.css";
import { faEarthAmericas, faLink, faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdCreationModal from "@pages/ad-creation/";
import AdPricePart from "../../components/shared/part/AdView/AdPricePart";
import { AxiosResponse } from "axios";
import { PureComponent, ReactNode, useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem } from "react-bootstrap";
import { AdBuyerView } from "../../entities/dto/AdBuyerView";
import { DisplayAdView } from "../../entities/dto/DisplayAdView";
import { deleteAd, getAdToModify, getCustomerAdPreview, getCustomerAds } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";
import { AdMapping } from "../ad-view";
import { AdCreator } from "@entities/dto/v2/AdCreator";

interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
    seeAdPreview(idAd: number): void;
    launchUpdate?(adCreator: AdCreator): void;
}

class DisplayAd extends PureComponent<DisplayAdProps> {
    public getDescriptionPart(): string {
        if (this.props.description.length > 270) {
            return this.props.description.slice(0, 270) + "...";
        } else return this.props.description;
    }

    public handleDelete(): void {
        deleteAd(this.props.idAd)
            .then(res => {
                if (res?.data) {
                    this.props.onDelete(this.props.idAd);
                }
            });
    }

    public getVisibilityIcon(): ReactNode {
        switch (this.props.visibility) {
            case 0:
                return <FontAwesomeIcon icon={faEarthAmericas} />;
            case 1:
                return <FontAwesomeIcon icon={faLock} />
            case 2:
                return <FontAwesomeIcon icon={faLink} />
        }
    }

    public render(): ReactNode {
        console.log("Rendered MyAds!!");

        return (
            <>
                <div className="display-post">
                    <title>My ads</title>
                    <div className="display-post-flex-with-img-desc">
                        <div className="dislay-post-img-section">
                            <img className="display-post-img imgFit" src={this.props.firstImage} />

                        </div>

                        <div className="mt-2 w-100">
                            <div className="d-flex justify-content-between">
                                <h1 className="my-0">{this.getVisibilityIcon()} {this.props.title}</h1>
                                <Dropdown >
                                    <Dropdown.Toggle size="lg" className="display-dropdown-color" />
                                    <Dropdown.Menu variant="light">
                                        <DropdownItem as={Button} onClick={async () => this.props.launchUpdate((await getAdToModify(this.props.link)).data)}>Modify</DropdownItem>
                                        <DropdownItem as={Button} onClick={() => this.props.seeAdPreview(this.props.idAd)}>Preview</DropdownItem>
                                        <DropdownItem bsPrefix="dropdown-item btn-danger" as={Button} className="dropdown-link" onClick={() => this.handleDelete()}>Delete</DropdownItem>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="my-1">
                                <AdPricePart price={this.props.price} isSold={this.props.isSold} />
                            </div>

                            <p className="display-description text-break">{this.getDescriptionPart()}</p>
                        </div>
                    </div>

                    <div className="display-post-options">

                    </div>
                </div>
            </>
        );
    }
}

function MyAds(props: { idCustomer?: number }) {
    const [displayAds, setDisplayAds] = useState<Array<DisplayAdView>>([]);
    const [isPreview, setIsPreview] = useState<boolean>(false);
    const [currentAdPreview, setCurrentAdPreview] = useState<Promise<AxiosResponse<AdBuyerView, any>>>();
    const [dialogState, setDialogState] = useState<{ open: boolean, adCreator: AdCreator }>({ open: false, adCreator: undefined });

    useEffect(() => {
        if (props.idCustomer && !dialogState.open) {
            getCustomerAds(props.idCustomer)
                .then(res => {
                    if (res?.data) {
                        setDisplayAds(res?.data);
                    }
                })
        }
    }, [props.idCustomer, dialogState]);

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
        setDialogState({ open: true, adCreator: undefined });
    }

    const onClose = () => {
        setDialogState({open : false, adCreator : undefined});
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
                                            idAd={value.idAd}
                                            description={value.description}
                                            firstImage={value.firstImage}
                                            isSold={value.isSold}
                                            price={value.price}
                                            title={value.title}
                                            visibility={value.visibility}
                                            link={value.link}
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

export default MyAds;