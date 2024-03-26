import { PureComponent, ReactNode } from "react";
import "../../css/component/page/MyAds.css";
import { Button, Dropdown, DropdownItem, SplitButton } from "react-bootstrap";
import { deleteAd, getCustomerAds } from "../../services/AdService";
import { DisplayAdView } from "../../entities/dto/DisplayAdView";
import { Link, useNavigate } from "react-router-dom";
import { createRandomKey } from "../../services/RandomKeys";

interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
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

    public render(): ReactNode {
        return (
            <>
                <div className="display-ad">
                    <div className="display-ad-flex-with-img-desc">
                        <div className="dislay-ad-img-section">
                            <img className="display-ad-img" src={this.props.firstImage} />
                            {this.props.isSold ?
                                (
                                    <img className="display-ad-is-sold" src="./img/vendu.jpg" />
                                ) : (
                                    <></>
                                )
                            }
                        </div>

                        <div>
                            <h1>{this.props.visibility} {this.props.title}</h1>
                            <p>REF : #{this.props.reference}</p>
                            <p>{this.getDescriptionPart()}</p>
                            <p>{this.props.price} $</p>
                        </div>
                    </div>

                    <div className="display-ad-options">
                        <Dropdown>
                            <SplitButton variant="dark" title="...">
                                <DropdownItem as={Link} to={`/ad-modification/${this.props.link}`}>Modify</DropdownItem>
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
    
    return(
        <Button onClick={() => navigate("/ad-creation")}>Create One</Button>
    )
};

export default class MyAds extends PureComponent {
    public state = {
        displayAds: new Array<DisplayAdView>(),
        isNoAds: false
    };

    public onDelete(idAd: number) {
        this.setState({ displayAds: this.state.displayAds.filter(ad => ad.idAd != idAd) });
    }

    public componentDidMount(): void {
        getCustomerAds(1)
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
            <>
                {this.state.displayAds.length > 0 ?
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
                        />
                    ))) : (
                        <div className="no-ads-found">
                            <h4>You have no ads.</h4>
                            <CreateAdButton />
                        </div>
                    )
                }
            </>
        );
    }
};