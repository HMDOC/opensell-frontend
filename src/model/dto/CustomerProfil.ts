import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";
import { CustomerInfo } from "./CustomerInfo";

export default interface CustomerProfil {
    username: string;
    joinedDate: string;
    ads: Array<AdPreviewDto>;
    customerInfo: CustomerInfo;
}