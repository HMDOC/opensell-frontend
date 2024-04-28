import { faShapes } from "@fortawesome/free-solid-svg-icons";
import { SelectorReader } from "./SharedAdPart";
import { AdShape } from "../../entities/dto/AdBuyerView";
import { Component, ReactNode, useEffect, useState } from "react";

export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];

interface AdShapePartProps {
    defaultValue: AdShape;
    isModif?: boolean;
    request?(value: any): void;
}

class AdShapePart extends Component<AdShapePartProps> {
    public render(): ReactNode {
        return(
            !this.props.isModif || this.props.defaultValue ?
            (
                <SelectorReader iconProp={faShapes} name="shape" title="Shape" options={SHAPE_ARRAY} request={this.props.request} defaultValue={this.props.defaultValue} />
            ) : (
                <></>
            )
        );
    }
}

export default AdShapePart;