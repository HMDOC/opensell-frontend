import http from "../http-commons";

export const getCustomerProfil = async (username? : String) => {
    return await http.get(`/user/${username}`);
}