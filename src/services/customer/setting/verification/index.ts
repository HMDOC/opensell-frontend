import http from "src/http-commons";

const REQUEST_MAPPING = "/api/customer/setting/verification";

export function isEmailExists(id: number, email: string) {
    return http.get<boolean>(`${REQUEST_MAPPING}/email/exists`, { params: { id, email } });
}

export function isUsernameExists(id: number, username: string) {
    return http.get<boolean>(`${REQUEST_MAPPING}/username/exists`, { params: { id, username } });
}