import * as jose from "jose";
import { CustomerDto } from "../entities/dto/CustomerDto";
import { getDto } from "./LogInService";
import { AxiosResponse } from "axios";

export default function getUserInfos(key: string): Promise<AxiosResponse<CustomerDto>> {
    let tokenValue = localStorage.getItem(key);
    if (tokenValue != null) {
        var payload = jose.decodeJwt(tokenValue);
        let id: any = payload.idCustomer;

        if(id) {
            return getDto(id);
        }
    } else return undefined;
}