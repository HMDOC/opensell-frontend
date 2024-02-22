import http from "../http-commons";

export const sendEmail = async (email: string, subject: string, text: string) => {
    return await http.get("/verification", { params: { email, subject, text } });
}