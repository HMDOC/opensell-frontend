import { AdTag } from "../model/dto/AdTag";
import { AdType } from "../model/dto/AdType";
import { DisplayAdView } from "../model/dto/DisplayAdView";
import http from "../http-commons";

const REQUEST_MAPPING = "/api/ad";

export const getAllAdTypes = async () => {
    return await http.get<Array<AdType>>(`${REQUEST_MAPPING}/get-all-ad-type`);
};

export const getAllAdTags = async () => {
    return await http.get<Array<AdTag>>(`${REQUEST_MAPPING}/get-all-ad-tag`);
};

/**
 * Call the backend to get all the ad of a customer.
 * 
 * @param customerId
 * @author Achraf
 */
export const getCustomerAds = async (customerId: number) => {
    return await http.get<Array<DisplayAdView>>(`${REQUEST_MAPPING}/get-customer-ads/${customerId}`);
};