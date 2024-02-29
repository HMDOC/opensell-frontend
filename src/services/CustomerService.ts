import http from "../http-commons";
import {CustomerModificationView} from "../component/dto/CustomerModificationView";
import {AxiosResponse} from "axios";
import {RegexCode} from "./FormService";

interface formInfo {
    type: string,
    labelName: string,
    name: string,
    code?: RegexCode
}

/**
 *
 * @author Olivier Mansuy
 */
export const getCustomerModificationView = async (link: string):Promise<AxiosResponse<CustomerModificationView>> => {
    return await http.get<CustomerModificationView>(`/c/get-customer-modification-view/${link}`);
}

export const formInformation: formInfo[] = [
    {type: "text", labelName: "Username", name:"username", code: RegexCode.USERNAME},
    {type: "text", labelName: "First name", name:"firstName",code: RegexCode.FIRST_NAME},
    {type: "text", labelName: "Last name", name:"lastName", code: RegexCode.LAST_NAME},
    {type: "text", labelName: "Public Email", name:"exposedEmail", code: RegexCode.EMAIL}
];

// export enum change {
//     USERNAME,
//     FIRSTNAME,
//     LASTNAME,
//     EXPOSEDEMAIL
// }