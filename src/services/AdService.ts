import { ModifType } from "../component/page/AdModification";
import http from "../http-commons";

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

export const testImages = async (formData: any) => {
    return await http.post<boolean>(`/ad/get-images`, formData);
};

export const getAdToModif = async (link: string) => {
    return await http.get<AdModifView>(`/ad/to-modify/${link}`);
};

export const changeAd = async (json: Map<String, Object>, idValue: number, imageDeal?: any) => {
    return await http.post(`/ad/test-map-json`, {json : Object.fromEntries(json), imageDeal : imageDeal}, {params : {idValue}});
};

export const adModification = async (modifType: ModifType, value: any, idAd: number) => {
    return await http.patch("/ad/modification", null, {params : {modifType, value, idAd}});
};

export const getAllAdTypes = async () => {
    return await http.get("/ad/get-all-ad-type");
};