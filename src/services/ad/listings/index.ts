import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";
import http from "../../../http-commons";
import AdCreatorDto from "./dto/AdCreatorDto";

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

export async function saveImages(formData: FormData) {
    return await http.post<Array<string>>(`${REQUEST_MAPPING}/images`, formData);
};


export async function createAd(adCreatorDto: AdCreatorDto) {
    return await http.post(`${REQUEST_MAPPING}`, adCreatorDto);
};

export async function updateAd(adCreatorDto: AdCreatorDto) {
    return await http.patch(`${REQUEST_MAPPING}`, adCreatorDto);
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