import { Component, PureComponent, ReactNode } from "react";
import "../../css/component/page/MyAds.css";
import { Button, Dropdown, DropdownItem, SplitButton } from "react-bootstrap";
import { deleteAd, getCustomerAdPreview, getCustomerAds } from "../../services/AdService";
import { DisplayAdView } from "../../entities/dto/DisplayAdView";
import { Link, useNavigate } from "react-router-dom";
import { createRandomKey } from "../../services/RandomKeys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLink, faLock } from "@fortawesome/free-solid-svg-icons";
import { AdMapping } from "./AdView";

interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
    seeAdPreview(idAd: number): void;
}

class DisplayAd extends PureComponent<DisplayAdProps> {
    public getDescriptionPart(): string {
        if (this.props.description.length > 70) {
            return this.props.description.slice(0, 70) + "...";
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
                            <img className="display-post-img" src={this.props.firstImage} />
                            {this.props.isSold ?
                                (
                                    <img className="display-post-is-sold" src="./img/vendu.jpg" />
                                ) : (
                                    <></>
                                )
                            }
                        </div>

                        <div>
                            <h1>{this.getVisibilityIcon()} {this.props.title}</h1>
                            <p>REF : #{this.props.reference}</p>
                            <p>{this.getDescriptionPart()}</p>
                            <p>{this.props.price} $</p>
                        </div>
                    </div>

                    <div className="display-post-options">
                        <Dropdown>
                            <SplitButton variant="dark" title="...">
                                <DropdownItem as={Link} to={`/ad-modification/${this.props.link}`}>Modify</DropdownItem>
                                <DropdownItem as={Button} onClick={() => this.props.seeAdPreview(this.props.idAd)}>Preview</DropdownItem>
                                <DropdownItem as={Button} className="dropdown-link" onClick={() => this.handleDelete()}>Delete</DropdownItem>
                            </SplitButton>
                        </Dropdown>
                    </div>
                </div>
            </>
        );
    }
}

const CreateAdButton = () => {
    const navigate = useNavigate();

    return (
        <Button onClick={() => navigate("/ad-creation")}>Create One</Button>
    )
};

export default class MyAds extends Component<{customerId: number}> {
    public state = {
        displayAds: new Array<DisplayAdView>(),
        isNoAds: false,
        isPreview: false,
        currentPromise : undefined,
    };

    public onDelete(idAd: number) {
        this.setState({ displayAds: this.state.displayAds.filter(ad => ad.idAd != idAd) });
    }

    public getCurrentPromise(idAd: number) {
        this.setState({currentPromise : getCustomerAdPreview(idAd), isPreview : true});
    }

    public componentDidMount(): void {
        getCustomerAds(this.props.customerId)
            .then(res => {
                if (res?.data) {
                    this.setState({ displayAds: res?.data });
                } else {
                    this.setState({ isNoAds: true });
                }
            })
    }

    public render(): ReactNode {
        return (
            <div>
                {this.state.isPreview ?
                    (
                        <AdMapping request={this.state.currentPromise} />
                    ) : (
                        this.state.displayAds.length > 0 ?
                        (this.state.displayAds?.map(value => (
                            <DisplayAd
                                key={createRandomKey()}
                                idAd={value.idAd}
                                description={value.description}
                                firstImage={value.firstImage}
                                isSold={value.isSold}
                                price={value.price}
                                reference={value.reference}
                                title={value.title}
                                visibility={value.visibility}
                                link={value.link}
                                onDelete={(idAd) => this.onDelete(idAd)}
                                seeAdPreview={(idAd) => this.getCurrentPromise(idAd)}
                            />
                        ))) : (
                            <div className="no-ads-found">
                                <h4>You have no ads.</h4>
                                <CreateAdButton />
                            </div>
                        )
                    )
                }
            </div>
        );
    }
};