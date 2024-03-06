import http from "../http-commons";
import {CustomerModificationView} from "../component/dto/CustomerModificationView";
import {AxiosResponse} from "axios";
import {RegexCode} from "./FormService";

export const INVALID_INPUT = "invalidInput";
export const VALID_INPUT = "validInput";

interface formInfo {
    type?: string,
    labelName: string,
    name: string,
    code?: RegexCode,
    rows?: number,
    cols?: number
}

export const formInformation: formInfo[] = [
    {type: "file", labelName: "ICON : ", name:"icon"},
    {type: "text", labelName: "Username : ", name:"username", code: RegexCode.USERNAME},
    {type: "text", labelName: "First name : ", name:"firstName",code: RegexCode.FIRST_NAME},
    {type: "text", labelName: "Last name : ", name:"lastName", code: RegexCode.LAST_NAME},
    {type: "text", labelName: "Public Email : ", name:"exposedEmail", code: RegexCode.EMAIL},
    {type: "text", labelName: "Address : ", name:"primaryAddress"}
];

export const bio: formInfo = {labelName: "Bio : ", name: "bio", cols: 40, rows: 10};

export const formSensibleInformation: formInfo[] = [
    {type: "text", labelName: "Private Email : ", name:"personalEmail", code: RegexCode.EMAIL},
    {type: "password", labelName: "PASSWORD : ", name:"pwd", code: RegexCode.PWD},
    {type: "text", labelName: "Phone number : ", name:"phoneNumber", code: RegexCode.PHONE_NUMBER}
]

export const getCustomerModificationView = async (link: string):Promise<AxiosResponse<CustomerModificationView>> => {
    return await http.get<CustomerModificationView>(`/c/get-customer-modification-view/${link}`);
}

export const getCompleteFormInfo = () => {
    let completeFormInfo: {} = {};
    formInformation.concat(bio).concat(formSensibleInformation).forEach((elem) => {
        completeFormInfo[elem.name] = elem;
    })
    return completeFormInfo;
}

//TEST
export const changeTest = async (link: string, endpoint: string): Promise<AxiosResponse> => {
    return await http.put(endpoint);
}

//TEST
const changeMapping = {

}