import http from "../../http-commons"
import { AxiosResponse } from "axios"
import { CustomerModificationData } from "../../entities/dto/CustomerModificationData"
import ModificationFeedback from "../../entities/dto/ModificationFeedback"

const REPLACE_SEQUENCE = "?";

export enum CMModalType {
    PERSONNAL_EMAIL,
    PASSWORD,
    BASIC_CHANGES,
    PHONE_NUMBER,
    ICON
}

export type ArrayOfRequests = {mapping: string, data: CustomerModificationData}[];

/**
 * @Note the first parameter is the original string
 * @param values 
 * @returns a new string containing the replacements
 */
export const replaceInString = (...values: string[]): string => {
    if (values.length >= 2) {
        let res: string = values[0];
        for (let elem = 1; elem < values.length + 1; elem++) res = res.replace(REPLACE_SEQUENCE + elem, values[elem]);
        return res;
    } else return values[0];
}

export const executeChange = async (request: string, data: CustomerModificationData): Promise<AxiosResponse<ModificationFeedback>> => {
    return await http.put<ModificationFeedback>(request, data);
}

export const getCheckResult = async (request: string): Promise<AxiosResponse<number>> => {
    return await http.get<number>(request);
}

export const getProfileIconPath = async (file: File) => {
    let formData: FormData = new FormData();
    formData.append("multipartFiles", file);
    return http.post<string>("change/get-image-icon-path", formData, {headers: {"Content-Type": "multipart/form-data", "Accept": "image/png"}});
}


