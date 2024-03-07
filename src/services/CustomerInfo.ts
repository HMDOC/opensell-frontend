import http from "../http-commons";

export const getCustomerInfo = async (link? : String) => {
    return await http.get(`/user/${link}`);
}

export const getPublicUserAds = async(link? : String) => {
    return await http.get(`/user/${link}/public-user-ads`)
}