import { ModifType } from "../component/shared/SharedAdPart";
import { AdTag } from "../entities/dto/AdTag";
import { AdType } from "../entities/dto/AdType";
import { DisplayAdView } from "../entities/dto/DisplayAdView";

import http from "../http-commons";
import { HtmlCode } from "./verification/HtmlCode";

/**
 * Get part of an Ad to show and ad in a customer view.
 * 
 * @param link 
 * @author Achraf
 */
export const getAdByLink = async (link: string) => {
    return await http.get<AdBuyerView>(`/ad/get-ad-buyer-view/${link}`);
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

    return await http.get<AdSearchPreview[]>(`/ad/search`, { params })
};

// TO DELETE AFTER FILE UPLOADER
export const testImages = async (formData: any) => {
    return await http.post<boolean>(`/ad/get-images`, formData);
};

/**
 * Get all the content of an Ad that can be modifiable. It is for
 * the modification page.
 * 
 * @param link
 * @author Achraf
 */
export const getAdToModif = async (link: string) => {
    return await http.get<AdModifView>(`/ad/to-modify/${link}`);
};

/**
 * Modify a field of an Ad.
 * 
 * @param modifType The field we want to cahnge
 * @param value The new value.
 * @param idAd The id of the ad
 * @author Achraf
 */
export const adModification = async (modifType: ModifType, value: any, idAd: number) => {
    return await http.patch<HtmlCode>("/ad/modification", {value}, {params : {modifType, idAd}});
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
    return await http.get<Array<DisplayAdView>>(`/ad/get-customer-ads/${customerId}`);
};

/**
 * To delete an Ad of an user.
 * 
 * @param idAd 
 * @author Achraf
 */
export const deleteAd = async (idAd: number) => {
    return await http.patch(`/ad/delete-ad/${idAd}`);
};

// GET THE AdPreview but ONLY FOR THE AD OWNER NOT FOR THE NORMAL USER
export const getCustomerAdPreview = async (idAd: number) => {
    return await http.get<AdBuyerView>(`/ad/get-ad-preview-for-customer/${idAd}`);
};

export const adModificationImageOrTags = async (tags: Array<string>, idAd: number, isImage: boolean) => {
    return await http.patch<HtmlCode>(`/ad/modification/image-or-tags`, tags, {params : {idAd, isImage}});
};