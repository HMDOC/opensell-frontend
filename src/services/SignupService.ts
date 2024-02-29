import http from "../http-commons";

export const checkSignup = async (email? : string, username?: String, pwd?) => {
    try {
        return await http.post("/signup", null, {params : {email, username, pwd}});
    } catch (error) {
        return error;
    }
}