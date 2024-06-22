import { AxiosResponse } from "axios";
import * as jose from "jose";
import { CustomerDto } from "../entities/dto/CustomerDto";
import { getDto } from "./LogInService";

export default async function getUserInfos(key: string): Promise<AxiosResponse<CustomerDto>> {
    let tokenValue = localStorage.getItem(key);

    if (tokenValue) {
        var payload = jose.decodeJwt(tokenValue);
        let id: any = payload.idCustomer;

        if(id) return getDto(id);
    }

    return await new Promise<AxiosResponse>((resolve, reject) => {}).then(res => {
        return res;
    })
}