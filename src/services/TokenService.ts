import { SignJWT, decodeJwt } from "jose";
import { AxiosResponse } from "axios";
import { CustomerDto } from "../model/dto/CustomerDto";
import { getCustomerDto } from "./customer/auth";

export const setToken = async (idCustomer: number) => {
    const secretKey = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET_KEY);
    const alg = "HS256";
    const jwt = await new SignJWT({ idCustomer })
        .setProtectedHeader({ alg })
        .sign(secretKey)
    localStorage.setItem("token", jwt);
}

export default async function getUserInfos(key: string): Promise<AxiosResponse<CustomerDto | undefined>> {
    let tokenValue = localStorage.getItem(key);

    if (tokenValue) {
        var payload = decodeJwt(tokenValue);
        let id: any = payload.idCustomer;

        if(id) return getCustomerDto(id);
    }

    return await new Promise((resolve) => resolve(undefined as any));
}