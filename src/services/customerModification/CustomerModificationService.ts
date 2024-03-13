import { AxiosResponse } from "axios";
import ModificationFeedback from "../../component/dto/ModificationFeedback";
import http from "../../http-commons";
import { RegexCode } from "./RegexService";

export const MAX_SOCIALS = 5;

export type formAttributes = {
    type?: string,
    labelName: string,
    name: string,
    code?: RegexCode,
    rows?: number,
    cols?: number,
    classList?: [],
    id?: string,
    isUnique: boolean
}

export type inputValidation = {
    value: string,
    isValid: boolean,
    feedbackMessage: string
}

export var initialState: {[key:string]: inputValidation} = {
    iconPath: {value: null, isValid: null, feedbackMessage: null},
    username: {value: null, isValid: null, feedbackMessage: null},
    firstName: {value: null, isValid: null, feedbackMessage: null},
    lastName: {value: null, isValid: null, feedbackMessage: null},
    exposedEmail: {value: null, isValid: null, feedbackMessage: null},
    primaryAddress: {value: null, isValid: null, feedbackMessage: null},
    bio: {value: null, isValid: null, feedbackMessage: null},
    personalEmail: {value: null, isValid: null, feedbackMessage: null},
    phoneNumber: {value: null, isValid: null, feedbackMessage: null},
    pwd: {value: null, isValid: null, feedbackMessage: null},
    social1: {value: null, isValid: null, feedbackMessage: null},
    social2: {value: null, isValid: null, feedbackMessage: null},
    social3: {value: null, isValid: null, feedbackMessage: null},
    social4: {value: null, isValid: null, feedbackMessage: null},
    social5: {value: null, isValid: null, feedbackMessage: null}
}

export const formInformation: {[key:string]: formAttributes} = {
    icon: {type: "file", labelName: "ICON : ", name:"icon", isUnique: false},
    username: {type: "text", labelName: "Username : ", name:"username", code: RegexCode.USERNAME, id: "usernameInput", isUnique: true},
    firstName: {type: "text", labelName: "First name : ", name:"firstName",code: RegexCode.FIRST_NAME, isUnique: false},
    lastName: {type: "text", labelName: "Last name : ", name:"lastName", code: RegexCode.LAST_NAME, isUnique: false},
    exposedEmail: {type: "text", labelName: "Public Email : ", name:"exposedEmail", code: RegexCode.EMAIL, isUnique: true},
    primaryAddress: {type: "text", labelName: "Address : ", name:"primaryAddress", isUnique: false},
    bio: {labelName: "Bio : ", name: "bio", cols: 40, rows: 10, isUnique: false},
    personalEmail: {type: "text", labelName: "Private Email : ", name:"personalEmail", code: RegexCode.EMAIL, isUnique: true},
    pwd: {type: "password", labelName: "PASSWORD : ", name:"pwd", code: RegexCode.PWD, isUnique: false},
    phoneNumber: {type: "text", labelName: "Phone number : ", name:"phoneNumber", code: RegexCode.PHONE_NUMBER, isUnique: true},
    social1: {type: "text", labelName: "Media : ", name:"social1", code: RegexCode.URL, isUnique: false},
    social2: {type: "text", labelName: "Media : ", name:"social2", code: RegexCode.URL, isUnique: false},
    social3: {type: "text", labelName: "Media : ", name:"social3", code: RegexCode.URL, isUnique: false},
    social4: {type: "text", labelName: "Media : ", name:"social4", code: RegexCode.URL, isUnique: false},
    social5: {type: "text", labelName: "Media : ", name:"social5", code: RegexCode.URL, isUnique: false},
}

export const executeChange = async (request: string): Promise<AxiosResponse<ModificationFeedback>> => {
    return await http.put<ModificationFeedback>(request);
}

export const executeChanges = async (requests:string[]) => {
    let resultArray:ModificationFeedback[] = [];
    for (let elem in requests) {
        await executeChange(requests[elem]).then((rep) => {
            resultArray.push(rep?.data);
        }).catch((error) => {
            console.log(error?.response?.data)
        }); 
    }
    return resultArray;
}


