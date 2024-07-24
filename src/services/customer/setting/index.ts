import http from "../../../http-commons"
import { AxiosResponse } from "axios"
import { CustomerModificationData } from "@model/dto/CustomerModificationData"
import ModificationFeedback from "@model/dto/ModificationFeedback"

const REQUEST_MAPPING = "/api/customer/setting/edit";

const REPLACE_SEQUENCE = "?";

export enum CMModalType {
    PERSONNAL_EMAIL,
    PASSWORD,
    BASIC_CHANGES,
    PHONE_NUMBER,
    ICON
}

export type ArrayOfRequests = { mapping: string, data: CustomerModificationData }[];

/**
 * @Note the first parameter is the original string
 * @param values 
 * @returns a new string containing the replacements
 */
export const replaceInString = (...values: string[]): string => {
    if (values.length >= 2) {
        let res: string = values[0];
        for (let elem = 1; elem < values.length + 1; elem++) res = res?.replace(REPLACE_SEQUENCE + elem, values[elem]);
        return res;
    } else return values[0];
}

export const executeChange = async (request: string, data: CustomerModificationData): Promise<AxiosResponse<ModificationFeedback>> => {
    return await http.patch<ModificationFeedback>(request, data);
}

export const getCheckResult = async (request: string): Promise<AxiosResponse<number>> => {
    return await http.get<number>(request);
}

export const changeCustomerIconPath = async (iconFile: File, idCustomer: number) => {
    let formData: FormData = new FormData();
    formData.append("iconFile", iconFile);

    return await http.patch(`${REQUEST_MAPPING}/${idCustomer}/icon`, formData);
}

export function isEmailExists(id: number, email: string) {
    return http.get<boolean>(`${REQUEST_MAPPING}/email/exists`, { params: { id, email } });
}


export function changeCustomerPersonalEmail(id: number, email: string, confirmEmail: string) {
    return http.patch(`${REQUEST_MAPPING}/private-email`, undefined, { params: { id, email, confirmEmail } })
}