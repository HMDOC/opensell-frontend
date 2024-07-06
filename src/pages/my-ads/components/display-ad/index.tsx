import AdPricePart from "@components/shared/part/AdView/AdPricePart";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { DisplayAdView } from "@entities/dto/DisplayAdView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import { Container, Stack } from "@mui/material";
import { deleteAd, getAdToModify } from "@services/AdService";
import { PureComponent, ReactNode } from "react";
import { Button, Dropdown, DropdownItem } from "react-bootstrap";

export interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
    seeAdPreview(idAd: number): void;
    launchUpdate?(adCreator: AdCreator): void;
}

export default class DisplayAd extends PureComponent<DisplayAdProps> {
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

    public render(): ReactNode {
        console.log("Rendered MyAds!!");

        return (
            <div className="display-post">
                <title>My ads</title>
                <div className="display-post-flex-with-img-desc">
                    <div className="dislay-post-img-section">
                        <img className="display-post-img imgFit" src={this.props.firstImage} />
                    </div>

                    <div className="mt-2 w-100">
                        <div className="d-flex justify-content-between">
                            <h2 className="my-0">{getVisibilityIcon(this.props.visibility)}{this.props.title}</h2>
                            
                            <Dropdown >
                                <Dropdown.Toggle size="lg" className="display-dropdown-color" />
                                <Dropdown.Menu variant="light">
                                    <DropdownItem as={Button} onClick={async () => this.props.launchUpdate((await getAdToModify(this.props.link)).data)}>Modify</DropdownItem>
                                    <DropdownItem as={Button} onClick={() => this.props.seeAdPreview(this.props.idAd)}>Preview</DropdownItem>
                                    <DropdownItem as={Button} className="dropdown-link" onClick={() => this.handleDelete()}>Delete</DropdownItem>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="my-1">
                            <AdPricePart price={this.props.price} isSold={this.props.isSold} />
                        </div>

                        <p className="display-description text-break">{this.getDescriptionPart()}</p>
                    </div>
                </div>
            </div>
        );
    }
}