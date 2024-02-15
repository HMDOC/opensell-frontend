import httpCommons from "../../http-commons";

export const checkLogin = async (username : string, password : string) => {
    return await httpCommons.post("/login", {username, password})
}