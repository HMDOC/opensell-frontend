import { ChangeEvent } from "react";
import { verify, RegexCode } from "./RegexService";

const INVALID_INPUT = "invalidInput";
const VALID_INPUT = "validInput";

const validateInputStyle = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const {classList} = inputElement.target;
    classList.remove(INVALID_INPUT);
    classList.add(VALID_INPUT);
}

const invalidateInputStyle = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const {classList} = inputElement.target;
    classList.remove(VALID_INPUT);
    classList.add(INVALID_INPUT);
}

const resetInputStyle = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    inputElement.target.classList.remove(VALID_INPUT, INVALID_INPUT);
}

export const formatInputElement = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, code: RegexCode, defaultValue: string, onInvalid: any): boolean => {
    const {name, value} = inputElement.target;
    if (value == "" || value == defaultValue) {
        resetInputStyle(inputElement);
        return null;
    } else if (!code && value !== defaultValue) {
        validateInputStyle(inputElement);
        return true;
    } else if (verify(value, code)) {
        validateInputStyle(inputElement);
        return true;
    } else {
        invalidateInputStyle(inputElement);
        onInvalid();
        return false;
    }
}

export const formatCopyOfInput = (inputElement: ChangeEvent<HTMLInputElement>, actualValue: string) => {
    const {value} = inputElement.target;
    if (value === "") {
        resetInputStyle(inputElement);
    } else if (value === actualValue) {
        validateInputStyle(inputElement);
    } else {
        invalidateInputStyle(inputElement);
    }
}