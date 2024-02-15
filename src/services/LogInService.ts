import http from "../http-commons";

export const checkLogin = async (username : string, pwd : string) => {
    return await http.post("/login", {username, pwd})
}