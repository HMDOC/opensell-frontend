import AdViewDto from "@services/ad/catalog/dto/AdViewDto";
import http from "../../../http-commons";
import AdPreviewDto from "./dto/AdPreviewDto";

const REQUEST_MAPPING = "/api/ad/catalog";

/**
    Search for ads with a query text and some filter options if necessary.
    @param query The search query
    @param filters Any optional filter included in this object will be added to the request
    @author Davide
*/
export async function getAdBySearch(filters: any) {
    return await http.post<AdPreviewDto[]>(`${REQUEST_MAPPING}/search`, filters);
};

/**
 * Get part of an Ad to show and ad in a customer view.
 * 
 * @param id
 * @author Achraf
 */
export async function getAdBuyerView(idAd: number): Promise<any> {
    try {
        return await http.get<AdViewDto>(`${REQUEST_MAPPING}/${idAd}`);
    } catch (error: any) {
        return new Promise((resolve) => resolve({ data: undefined, status: error?.response.status }))
    }
};