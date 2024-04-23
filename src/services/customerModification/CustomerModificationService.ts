import http from "../../http-commons"
import { CustomerModificationView } from "../../entities/dto/CustomerModificationView"
import { AxiosResponse } from "axios"
import { CustomerModificationData } from "../../entities/dto/CustomerModificationData"
import ModificationFeedback from "../../entities/dto/ModificationFeedback"
import { RegexCode, verify } from "../RegexService"
import { CustomerInfo } from "../../entities/dto/CustomerInfo"

const CHANGE_REQUEST_MAPPING = "change";
const CEHCK_REQUEST_MAPPING = "c";
const REPLACE_SEQUENCE = "?";
export const NOTHING_CHANGED = "Nothing changed...";

export type ArrayOfRequests = {mapping: string, data: CustomerModificationData}[];

export interface CustomerModificationProperties {
    customerData: number
}

export interface CustomerModificationState {
    feedbackMessages: string[],
    defaultValues: CustomerModificationView
}

export const getCustomerModificationView = async (identification: number):Promise<AxiosResponse<CustomerModificationView>> => {
    return await http.get<CustomerModificationView>(`/c/get-customer-modification-view?id=${identification}`);
}

interface CustomerModificationInputObject {
    inputValueIsValid(value: string, defaultValue: string): boolean, //or Promise<boolean>
    modificationEndPoint: string,
    errors: {[errorType:string]: string},
    uniqueCheck?: string
}

const validateInput = (value: string, defaultValue: string, code: RegExp): boolean => {
    if (!defaultValue) defaultValue = "";
    if (verify(value, code) && value !== defaultValue) return true;
    else if (value === defaultValue) return null;
    return false;
}

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

export const formValidationObject: {[fieldName:string]: CustomerModificationInputObject} = {
    username: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.USERNAME),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-username`,
        errors: {unique: "This username already exists in our system!", format: "Your new username can't contain special characters and must be between 1 and 30 characters!"},
        uniqueCheck: `${CEHCK_REQUEST_MAPPING}/check-username?username=?1`
    },
    firstName: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.FIRST_LAST_NAME),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-first-name`,
        errors: {format: "Your first name can't have any numbers (with one space or - followed by more characters) and needs to be between 1 and 30 characters!"}
    },
    lastName: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.FIRST_LAST_NAME),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-last-name`,
        errors: {format: "Your last name can't have any numbers (with one space or - followed by more characters)!"}
    },
    exposedEmail: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.EMAIL),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-public-email`,
        errors: {unique: "This email address already exists in our system!", format: "Wrong email format!"},
        uniqueCheck: `${CEHCK_REQUEST_MAPPING}/check-public-email?email=?1`
    },
    bio: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.LIMIT5000),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-bio`,
        errors: {format: "Can't be more than 5000 characters!"}
    },
    personalEmail: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.EMAIL),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-private-email`,
        errors: {unique: "This email (personal) address already exists in our system!", format: "Wrong email (personal) format!"},
        uniqueCheck: `${CEHCK_REQUEST_MAPPING}/check-private-email?email=?1`
    },
    pwd: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.pwd),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/change-pwd`,
        errors: {unique: "You're already using this password!", format: "Your password must contain..."},
        uniqueCheck: `${CEHCK_REQUEST_MAPPING}/check-same-pwd?pwd=?1&id=?2`
    }
}

export const executeChange = async (request: string, data: CustomerModificationData): Promise<AxiosResponse<ModificationFeedback>> => {
    return await http.put<ModificationFeedback>(request, data);
}

export const getCheckResult = async (request: string): Promise<AxiosResponse<number>> => {
    return await http.get<number>(request);
}
// export const changeMapping: {[key:string]:string} = {
//     icon: `${CHANGE_REQUEST_MAPPING}/change-icon-path`,
//     username: `${CHANGE_REQUEST_MAPPING}/change-username`,
//     firstName: `${CHANGE_REQUEST_MAPPING}/change-first-name`,
//     lastName: `${CHANGE_REQUEST_MAPPING}/change-last-name`,
//     exposedEmail: `${CHANGE_REQUEST_MAPPING}/change-public-email`,
//     bio: `${CHANGE_REQUEST_MAPPING}/change-bio`,
//     personalEmail: `${CHANGE_REQUEST_MAPPING}/change-private-email`,
//     pwd: `${CHANGE_REQUEST_MAPPING}/change-pwd`,
//     phoneNumber: `${CHANGE_REQUEST_MAPPING}/change-phone-number`,
// }


