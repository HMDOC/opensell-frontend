import http from "../http-commons";

export const getCustomerInfo = async (link? : String) => {
    try {
        return await http.get(`/user/${link}`, {params : {link}});
    } catch (error) {
        return error;
    }
}