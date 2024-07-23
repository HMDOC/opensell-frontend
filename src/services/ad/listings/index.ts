import http from "../../../http-commons";
import AdImage from "@model/AdImage";
import AdCreatorDto from "./dto/AdCreatorDto";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";

const REQUEST_MAPPING = "/api/ad/listings";

/**
 * Get all the content of an Ad that can be modifiable. It is for
 * the modification page.
 * 
 * @param link
 * @author Achraf
 */
export async function getAdToModify(idAd: number) {
    return await http.get<AdCreatorDto>(`${REQUEST_MAPPING}/${idAd}`);
};

/**
 * To delete an Ad of an user.
 * 
 * @param idAd 
 * @author Achraf
 */
export async function deleteAd(idAd: number) {
    return await http.delete(`${REQUEST_MAPPING}/${idAd}`);
};

/**
 * To check if a user already have an ad with this title.
 * 
 * @param title
 * @param customerId
 */
export async function isTitleConstraintOk(title: string, customerId: number, adId?: number) {
    return http.get<boolean>(`${REQUEST_MAPPING}/is-title-constraint-ok`, { params: { title, customerId, adId } });
}

export async function createAd(formData: FormData) {
    return await http.post<Array<AdImage>>(`${REQUEST_MAPPING}`, formData);
};

export async function updateAd(formData: FormData) {
    return await http.patch<Array<AdImage>>(`${REQUEST_MAPPING}`, formData);
};

/**
 * Call the backend to get all the ad of a customer.
 * 
 * @param customerId
 * @author Achraf
 */
export const getCustomerAds = async (customerId: number) => {
    return await http.get<Array<AdPreviewDto>>(`${REQUEST_MAPPING}/${customerId}/all`);
};