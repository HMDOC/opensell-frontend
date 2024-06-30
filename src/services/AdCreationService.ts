import { AdImage } from "@entities/dto/AdBuyerView";
import { AdTagsError } from "@shared/AdTags";
import { HTMLInputTypeAttribute } from "react";
import { Schema } from "yup";
import http from "../../src/http-commons";
import { AdType } from "../entities/dto/AdType";
import { BlockImage } from "../entities/dto/BlockImages";

export interface AdCreationInputObject {
    errorMessage: string,
    isValid?: (value: string) => boolean,
}

export function isBetween(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length < max;
}

export const formValidation: {[key:string]: AdCreationInputObject} = {
    title: {errorMessage: "Title must be between 1 and 80 characters!", isValid: (value: string) => {return isBetween(value, 1, 80)}},
    price: {errorMessage: "Price field can't be negative or empty!", isValid: (value: string) => {return parseFloat(value) >= 0}},
    address: {errorMessage: "Address can't be empty (80 characters max)!", isValid: (value: string) => {return isBetween(value, 1, 80)}},
    reference: {errorMessage: "Too many characters!", isValid: (value: string) => {return value === null || value?.length < 80}},
    description: {errorMessage: "Description must be between 1 and 5000 characters!", isValid: (value: string) => {return isBetween(value, 1, 5000)}}
}

export interface AdCreationState {
    globalErrorMessage: string,
    errorAdTags: AdTagsError,
    typeArray: AdType[],
    selectedTags: string[],
    images: Array<BlockImage>,
    errorImages: string,
    adWasCreated: boolean
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

export const v2CreateAd = async (formData: FormData) => {
    return await http.post<Array<AdImage>>("/ad/v2/update", formData);
};