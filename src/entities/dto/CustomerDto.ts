import { CustomerInfo } from "./CustomerInfo";

export interface CustomerDto {
    customerInfo: CustomerInfo;
    customerId: number;
	username: string;
    link: string;
    joinedDate: Date
};