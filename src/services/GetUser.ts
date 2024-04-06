import * as jose from "jose";
import { CustomerInfoView } from "../entities/dto/CustomerInfo";

export default function getUserInfos(key: string): CustomerInfoView {
    let tokenValue = localStorage.getItem(key);
    if (tokenValue != null) {
        var payload = jose.decodeJwt(tokenValue);
        let infos: CustomerInfoView;
        infos = payload.customerInfo;
        return infos;
    } else return undefined;
}