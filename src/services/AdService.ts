import { AdImgSave } from "../component/dto/AdImgSave";
import http from "../http-commons";
import data from "../data.json"
import axios from "axios";

export const getAdByLink = async (link: string) => {
    return await http.get<AdBuyerView>(`/ad/get-ad-buyer-view/${link}`);
};
/*
defaultValue = "" String query,
defaultValue = 0 Double priceMin,
defaultValue = 9999999d Double priceMax,
defaultValue = 2020-01-01 Date dateMin,
defaultValue = "3000-01-01") Date dateMax,
defaultValue = null Integer typeId, 
defaultValue = null Set<String> tagListId,
defaultValue = null Integer shapeId,
@RequestParam(required = false) Boolean filterSold,
defaultValue = "addedDate" String sortBy
*/
export const getAdBySearch = async (query: string, filters) => {
    filters.query = query;
    //filters.filterSold = false;
    let params = filters;

    return await http.get<AdSearchPreview[]>(`/ad/search`, { params })
}

export const testImages = async (formData: any) => {
    return await http.post<boolean>(`/ad/get-images`, formData);
}