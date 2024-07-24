import { RegexCode, verify } from "../RegexService";


interface CustomerModificationInputObject {
    inputValueIsValid?(value: string, defaultValue: string): boolean, //or Promise<boolean>
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

const REQUEST_MAPPING = "/api/customer/setting";
const CHANGE_REQUEST_MAPPING = `${REQUEST_MAPPING}/edit`;
const CHECK_REQUEST_MAPPING = `${REQUEST_MAPPING}/verification`;

export const FormValidationObject: {[fieldName:string]: CustomerModificationInputObject} = {
    username: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.USERNAME),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/username`,
        errors: {unique: "This username already exists in our system!", format: "Your new username can't contain special characters and must be between 1 and 30 characters!"},
        uniqueCheck: `${CHECK_REQUEST_MAPPING}/username?username=?1`
    },
    firstName: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.FIRST_LAST_NAME),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/first-name`,
        errors: {format: "Your first name can't have any numbers (with one space or - followed by more characters) and needs to be between 1 and 30 characters!"}
    },
    lastName: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.FIRST_LAST_NAME),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/last-name`,
        errors: {format: "Your last name can't have any numbers (with one space or - followed by more characters)!"}
    },
    exposedEmail: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.EMAIL),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/public-email`,
        errors: {unique: "This email address already exists in our system!", format: "Wrong email format!"},
        uniqueCheck: `${CHECK_REQUEST_MAPPING}/public-email?email=?1`
    },
    bio: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.LIMIT5000),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/bio`,
        errors: {format: "Can't be more than 5000 characters!"}
    },
    pwd: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.PWD),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/pwd`,
        errors: {unique: "You're already using this password!", format: "Your password must contain at least 8 characters, one special character, number and lower/hupper case letter..."},
        uniqueCheck: `${CHECK_REQUEST_MAPPING}/same-pwd?pwd=?1&id=?2`
    },
    phoneNumber: {
        inputValueIsValid: (value: string, defaultValue: string) => validateInput(value, defaultValue, RegexCode.PHONE_NUMBER),
        modificationEndPoint: `${CHANGE_REQUEST_MAPPING}/phone-number`,
        errors: {unique: "This number already exists in our system!", format: "Wrong phone number format...(123-456-7890)"},
        uniqueCheck: `${CHECK_REQUEST_MAPPING}/phone-number?phoneNumber=?1`
    }
}