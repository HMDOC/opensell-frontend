import http from "../http-commons";

export const verifyCode = async (codeInput? : string) => {
    try {
        return await http.post("/verification", null, {params : {codeInput}});
    } catch (error) {
        return error;
    }
}