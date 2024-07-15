import { AdCreator } from "@entities/dto/v2/AdCreator";
import { AdBuyerView, AdImage } from "../entities/dto/AdBuyerView";
import { AdTag } from "../entities/dto/AdTag";
import { AdType } from "../entities/dto/AdType";
import { DisplayAdView } from "../entities/dto/DisplayAdView";
import http from "../http-commons";

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

    return await http.post<AdSearchPreview[]>(`/ad/search`, params)
};

/**
 * Get all the content of an Ad that can be modifiable. It is for
 * the modification page.
 * 
 * @param link
 * @author Achraf
 */
export const getAdToModify = async (link: string) => {
    return await http.get<AdCreator>(`/ad/to-modify/${link}`);
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

export const saveAdImages = async (images: Array<File>, idAd: number, isModif: boolean = false, idsToDelete: Array<number> = null) => {
    let imagesFormData = new FormData();
    images.forEach(img => imagesFormData.append("adImages", img));
    return await http.post<Array<AdImage>>("/ad/save-ad-images", imagesFormData, { params: { idAd, isModif, idsToDelete }, paramsSerializer: { indexes: null } });
};

/**
 * To check if a user already have an ad with this title.
 * 
 * @param title
 * @param customerId
 */
export const isTitleConstraintOk = async (title: string, customerId: number, adId?: number) => {
    return http.get<boolean>(`ad/v2/is-title-constraint-ok`, { params: { title, customerId, adId } });
}