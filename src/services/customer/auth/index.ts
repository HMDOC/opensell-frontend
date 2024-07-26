import { CustomerDto } from "@services/customer/auth/CustomerDto";
import http from "../../../http-commons";

const REQUEST_MAPPING = "/api/customer/auth";

export const getCustomerDto = async (idCustomer: number) => {
    return http.get<CustomerDto>(REQUEST_MAPPING, { params: { idCustomer } });
}

export const login = async (username?: string, pwd?: string) => {
    return await http.get(`${REQUEST_MAPPING}/login`, { params: { username, pwd } });
}

export const signup = async (email?: string, username?: String, pwd?: string) => {
    return await http.post(`${REQUEST_MAPPING}/signup`, null, { params: { email, username, pwd } });
}

export const verifyCode = async (email?: string, inputCode?: string) => {
    return await http.get(`${REQUEST_MAPPING}/verify-code`, { params: { email, inputCode } });
}