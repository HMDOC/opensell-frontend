import http from "../http-commons";

export const checkLogin = async (username? : string, pwd? : string) => {
    try {
        return await http.get("/login", {params : {username, pwd}});
    } catch (error) {
        return error;
    }
}