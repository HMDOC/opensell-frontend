import { AxiosResponse } from "axios";
import { CustomerModificationView } from "../../entities/dto/CustomerModificationView";
import http from "../../http-commons";

const CHANGE_REQUEST_MAPPING = "change";
const CEHCK_REQUEST_MAPPING = "c";
const VALUE_REPLACE_STR = "{value}";
const CUSTOMER_LINK_REPLACE_STR = "{customer_link}"; 

export const changeMapping: {[key:string]:string} = {
    icon: `${CHANGE_REQUEST_MAPPING}/change-icon-path?link=${CUSTOMER_LINK_REPLACE_STR}&iconPath=${VALUE_REPLACE_STR}`,
    username: `${CHANGE_REQUEST_MAPPING}/change-username?link=${CUSTOMER_LINK_REPLACE_STR}&username=${VALUE_REPLACE_STR}`,
    firstName: `${CHANGE_REQUEST_MAPPING}/change-first-name?link=${CUSTOMER_LINK_REPLACE_STR}&firstName=${VALUE_REPLACE_STR}`,
    lastName: `${CHANGE_REQUEST_MAPPING}/change-last-name?link=${CUSTOMER_LINK_REPLACE_STR}&lastName=${VALUE_REPLACE_STR}`,
    exposedEmail: `${CHANGE_REQUEST_MAPPING}/change-public-email?link=${CUSTOMER_LINK_REPLACE_STR}&email=${VALUE_REPLACE_STR}`,
    primaryAddress: `${CHANGE_REQUEST_MAPPING}/change-primary-address?link=${CUSTOMER_LINK_REPLACE_STR}&address=${VALUE_REPLACE_STR}`,
    bio: `${CHANGE_REQUEST_MAPPING}/change-bio?link=${CUSTOMER_LINK_REPLACE_STR}&bio=${VALUE_REPLACE_STR}`,
    personalEmail: `${CHANGE_REQUEST_MAPPING}/change-private-email?link=${CUSTOMER_LINK_REPLACE_STR}&email=${VALUE_REPLACE_STR}`,
    pwd: `${CHANGE_REQUEST_MAPPING}/change-pwd?link=${CUSTOMER_LINK_REPLACE_STR}&pwd=${VALUE_REPLACE_STR}`,
    phoneNumber: `${CHANGE_REQUEST_MAPPING}/change-phone-number?link=${CUSTOMER_LINK_REPLACE_STR}&phoneNumber=${VALUE_REPLACE_STR}`,
    social1: `${CHANGE_REQUEST_MAPPING}/change-socials-1?cLink=${CUSTOMER_LINK_REPLACE_STR}&link=${VALUE_REPLACE_STR}`,
    social2: `${CHANGE_REQUEST_MAPPING}/change-socials-2?cLink=${CUSTOMER_LINK_REPLACE_STR}&link=${VALUE_REPLACE_STR}`,
    social3: `${CHANGE_REQUEST_MAPPING}/change-socials-3?cLink=${CUSTOMER_LINK_REPLACE_STR}&link=${VALUE_REPLACE_STR}`,
    social4: `${CHANGE_REQUEST_MAPPING}/change-socials-4?cLink=${CUSTOMER_LINK_REPLACE_STR}&link=${VALUE_REPLACE_STR}`,
    social5: `${CHANGE_REQUEST_MAPPING}/change-socials-5?cLink=${CUSTOMER_LINK_REPLACE_STR}&link=${VALUE_REPLACE_STR}`,
}

export const checkMapping: {[key:string]:string} = {
    username: `${CEHCK_REQUEST_MAPPING}/check-username?username=${VALUE_REPLACE_STR}`,
    exposedEmail: `${CEHCK_REQUEST_MAPPING}/check-public-email?email=${VALUE_REPLACE_STR}`,
    personalEmail: `${CEHCK_REQUEST_MAPPING}/check-private-email?email=${VALUE_REPLACE_STR}`,
    phoneNumber: `${CEHCK_REQUEST_MAPPING}/check-phone-number?phoneNumber=${VALUE_REPLACE_STR}`
}

export const checkSamePwd = async(link: string, pwd: string):Promise<AxiosResponse<number>> => {
    return http.get<number>(`${CEHCK_REQUEST_MAPPING}/check-same-pwd?cLink=${link}&pwd=${pwd}`);
}

export const getCustomerModificationView = async (link: string):Promise<AxiosResponse<CustomerModificationView>> => {
    return await http.get<CustomerModificationView>(`/c/get-customer-modification-view/${link}`);
}

export const getCheckResult = async (request: string): Promise<AxiosResponse<number>> => {
    return await http.get<number>(request);
}

export const getRequest = (customer_link: string, key: string, value: string): string => {
    if (customer_link && key && value) {
        return changeMapping[key].replace(CUSTOMER_LINK_REPLACE_STR, customer_link).replace(VALUE_REPLACE_STR, value); 
    }
    return checkMapping[key].replace(VALUE_REPLACE_STR, value);
}