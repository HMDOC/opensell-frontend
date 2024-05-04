import http from "../http-commons";

export const verifyCode = async (email? : string, inputCode? : string) => {
    try {
        return await http.get("/verify-code", {params : {email, inputCode}});
    } catch (error) {
        return error;
    }
}