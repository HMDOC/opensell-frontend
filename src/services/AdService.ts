import { AdImgSave } from "../component/dto/AdImgSave";
import http from "../http-commons";
import data from "../data.json"
import axios from "axios";

export const getAdByLink = async (link: string) => {
    return await http.get<AdBuyerView>(`/ad/get-ad-buyer-view/${link}`);
};

export const getAdBySearch = async (query: string) => {
    return await http.get<AdSearchPreview>(`/ad/search`)
}

export const testImages = async (formData: any) => {
    return await http.post<boolean>(`/ad/get-images`, formData);
}