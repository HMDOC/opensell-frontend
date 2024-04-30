import { PureComponent, ReactNode, useEffect, useState } from "react";
import "../../css/component/page/MyAds.css";
import "../../css/component/part/ImageFit.css";
import { Button, Dropdown, DropdownItem, SplitButton } from "react-bootstrap";
import { deleteAd, getCustomerAdPreview, getCustomerAds } from "../../services/AdService";
import { DisplayAdView } from "../../entities/dto/DisplayAdView";
import { Link, useNavigate } from "react-router-dom";
import { createRandomKey } from "../../services/RandomKeys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLink, faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AdMapping } from "./AdView";
import { AxiosResponse } from "axios";
import { AdBuyerView } from "../../entities/dto/AdBuyerView";
import AdPricePart from "../part/AdView/AdPricePart";
import AdCreationModal from "../part/AdCreationModal";

interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
    seeAdPreview(idAd: number): void;
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
        return (
            <>
                <div className="display-post">
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
                                        <DropdownItem as={Link} to={`/u/ad-modification/${this.props.link}`} target="_blank">Modify</DropdownItem>
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

const MyAds = (props: { idCustomer?: number }) => {
    const [displayAds, setDisplayAds] = useState<Array<DisplayAdView>>([]);
    const [isPreview, setIsPreview] = useState<boolean>(false);
    const [currentAdPreview, setCurrentAdPreview] = useState<Promise<AxiosResponse<AdBuyerView, any>>>();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (props.idCustomer && !modalIsOpen) {
            getCustomerAds(props.idCustomer)
                .then(res => {
                    if (res?.data) {
                        setDisplayAds(res?.data);
                    }
                })
        }
    }, [props.idCustomer, modalIsOpen]);

    function onDelete(idAd: number) {
        setDisplayAds(displayAds.filter(ad => ad.idAd != idAd));
    }

    function getCurrentPromise(idAd: number) {
        setCurrentAdPreview(getCustomerAdPreview(idAd));
        setIsPreview(true);
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
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
                        {displayAds.length > 0 ? (
                        <>
                        <div className="display-header d-flex justify-content-between">
                            <h1 className="fs-1 text-black"> <b>My ads</b></h1>
                            <Button onClick={() => openModal()}><FontAwesomeIcon icon={faPlus} /></Button>
                        </div>

                            <div style={{ overflowY: "scroll", height: "90vh" }} className="">
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
                                    />))}
                            </div>
                            </>
                        ) : (
                            <div className="back-div">
                                <h4>You have no ads</h4>
                            </div>
                        )}
                    </div>
                )
            }
            <AdCreationModal idCustomer={props.idCustomer} isOpen={modalIsOpen} onCloseRequest={() => closeModal()} />
        </>
    );
}

export default MyAds;