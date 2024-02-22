import http from "../http-commons";

export const sendEmail = async (email? : string, subject?: String, text? : string) => {
    try {
        return await http.post("/sendEmail", null, {params : {email, subject, text}});
    } catch (error) {
        return error;
    }
}