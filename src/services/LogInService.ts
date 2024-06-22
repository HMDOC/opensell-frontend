import http from "../http-commons";

export const checkLogin = async (username? : string, pwd? : string) => {
    try {
        return await http.get("/login", {params : {username, pwd}});
    } catch (error) {
        return error;
    }
}

export const getDto = async (idCustomer: number) => {
    try {
        return http.get("/getDto", {params: {idCustomer}});
    } catch (error) {
        return error;
    }
}