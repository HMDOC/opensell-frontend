import http from "../http-commons";

export const checkLogin = async (username? : string, pwd? : string) => {
    try {
        return await http.post("/login", null, {params : {username, pwd}});
    } catch(error) {

    }
}