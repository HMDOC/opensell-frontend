import { CustomerInfo } from "./CustomerInfo";

export default interface CustomerProfil {
    username: string;
    joinedDate: string;
    ads: Array<AdSearchPreview>;
    customerInfo: CustomerInfo;
}