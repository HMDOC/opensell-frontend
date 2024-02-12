import http from "../http-commons";
import data from "../data.json";

export const getAdByLink = async (link: string) => {
    try {
        return await http.get<AdBuyerView>(`/get-ad-buyer-view/${link}`);
    } catch(error) {
        throw "Cannot get data from backend.";
    }
};