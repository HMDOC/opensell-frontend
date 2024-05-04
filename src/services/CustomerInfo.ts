import http from "../http-commons";

export const getCustomerProfil = async (link? : String) => {
    return await http.get(`/user/${link}`);
}