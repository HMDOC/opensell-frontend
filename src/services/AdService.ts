import http from "../http-commons";

export const getAdByLink = async (link: string) => {
    return await http.get<AdBuyerView>(`/ad/get-ad-buyer-view/${link}`);
};

export const getAdBySearch = async (query: string) => {
    return await http.get<AdSearchPreview>(`/ad/search`)
}