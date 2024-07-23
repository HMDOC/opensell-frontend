import { AdBuyerView } from "../entities/dto/AdBuyerView";
import { AdTag } from "../entities/dto/AdTag";
import { AdType } from "../entities/dto/AdType";
import { DisplayAdView } from "../entities/dto/DisplayAdView";
import http from "../http-commons";

/**
 * Get part of an Ad to show and ad in a customer view.
 * 
 * @param id
 * @author Achraf
 */
export const getAdById = async (id: number): Promise<any> => {
    try {
        return await http.get<AdBuyerView>(`/ad/get-ad-buyer-view/${id}`);
    } catch (error: any) {
        return new Promise((resolve) => resolve({ data: undefined, status: error?.response.status }))
    }
};

/**
    Search for ads with a query text and some filter options if necessary.
    @param query The search query
    @param filters Any optional filter included in this object will be added to the request
    @author Davide
*/
export const getAdBySearch = async (query: string, filters) => {
    filters.query = query;
    //filters.filterSold = false;
    let params = filters;

    return await http.post<AdSearchPreview[]>(`/ad/search`, params)
};

export const getAllAdTypes = async () => {
    return await http.get<Array<AdType>>("/ad/get-all-ad-type");
};

export const getAllAdTags = async () => {
    return await http.get<Array<AdTag>>("/ad/get-all-ad-tag");
};

/**
 * Call the backend to get all the ad of a customer.
 * 
 * @param customerId
 * @author Achraf
 */
export const getCustomerAds = async (customerId: number) => {
    console.log("get it");
    return await http.get<Array<DisplayAdView>>(`/ad/get-customer-ads/${customerId}`);
};