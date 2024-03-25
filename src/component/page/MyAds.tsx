import { PureComponent, ReactNode } from "react";
import "../../css/component/page/MyAds.css";
import { Button, Dropdown, DropdownItem, SplitButton } from "react-bootstrap";
import { deleteAd, getCustomerAds } from "../../services/AdService";
import { DisplayAdView } from "../../entities/dto/DisplayAdView";
import { Link } from "react-router-dom";
import { createRandomKey } from "../../services/RandomKeys";

class DisplayAd extends PureComponent<DisplayAdView> {
    public getDescriptionPart(): string {
        if (this.props.description.length > 70) {
            return this.props.description.slice(0, 70) + "...";
        } else return this.props.description;
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
                                <DropdownItem as={Link} to={`/ad/${this.props.link}`}>Modify</DropdownItem>
                                <DropdownItem as={Button} className="dropdown-link" onClick={() => deleteAd(this.props.idAd).then(res => console.log(res?.data))}>Delete</DropdownItem>
                            </SplitButton>
                        </Dropdown>
                    </div>
                </div>
            </>
        );
    }
}

export default class MyAds extends PureComponent {
    public state = {
        displayAds: new Array<DisplayAdView>(),
        isNoAds: false
    };

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
                {this.state.displayAds?.map(value => (
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
                    />
                ))}
            </>
        );
    }
};