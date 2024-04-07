import * as jose from "jose";
import { CustomerInfo } from "../entities/dto/CustomerInfo";
import { CustomerDto } from "../entities/dto/CustomerDto";
import { getDto } from "./LogInService";
import { AxiosResponse } from "axios";

export default function getUserInfos(key: string): Promise<AxiosResponse<CustomerDto>> {
    let tokenValue = localStorage.getItem(key);
    if (tokenValue != null) {
        var payload = jose.decodeJwt(tokenValue);
        let id: any = payload.idCustomer;
        return getDto(id);
    } else return undefined;
}