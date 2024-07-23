import { HTMLInputTypeAttribute } from "react";

/**
 * 
 * @deprecated
 * @forRemoval
 */
export interface AdCreationInputObject {
    errorMessage: string,
    isValid?: (value: string) => boolean,
}

/**

 * @deprecated
 * @forRemoval
 */
export function isBetween(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length < max;
}

/**

 * @deprecated
 * @forRemoval
 */
export const formValidation: {[key:string]: AdCreationInputObject} = {
    title: {errorMessage: "Title must be between 1 and 80 characters!", isValid: (value: string) => {return isBetween(value, 1, 80)}},
    price: {errorMessage: "Price field can't be negative or empty!", isValid: (value: string) => {return parseFloat(value) >= 0}},
    address: {errorMessage: "Address can't be empty (80 characters max)!", isValid: (value: string) => {return isBetween(value, 1, 80)}},
    description: {errorMessage: "Description must be between 1 and 5000 characters!", isValid: (value: string) => {return isBetween(value, 1, 5000)}}
}

export interface AdCreationInputProperties {
    type?: HTMLInputTypeAttribute;
    name: string;
    labelText: string;
    min?: number;
    max?: number;
    placeholder?: string;
    step?: number;
    accept?: string;
}