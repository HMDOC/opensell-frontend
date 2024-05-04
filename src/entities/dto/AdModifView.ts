import { AdBuyerView } from "./AdBuyerView";

export interface AdModifView extends AdBuyerView {
    idAd: number;
    reference: string;
    link: string;
}