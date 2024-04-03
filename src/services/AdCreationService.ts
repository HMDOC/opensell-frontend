import { ChangeEvent, RefObject } from "react"
import { SelectorReader } from "../component/shared/SharedAdPart"
import { AdType } from "../entities/dto/AdType"
import { HtmlCode } from "./verification/HtmlCode"

interface AdCreationInputObject {
    errorMessage: string,
    inputRef: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>,
    value?: string[],
    isValid: (value: string | number | string[]) => boolean,
    isFileInput?: boolean
}

export function isBetween(value: string, min: number, max: number): boolean {
    return value.length > min && value.length < max;
}

export interface AdCreationState {
    globalErrorMessage: string,
    errorAdTags: HtmlCode,
    typeArray: AdType[],
    adTags: string[],
    title: AdCreationInputObject,
    description: AdCreationInputObject,
    price: AdCreationInputObject,
    address: AdCreationInputObject,
    reference: AdCreationInputObject
    images: AdCreationInputObject
}

export interface AdCreationInputProperties {
    type: string,
    name: string,
    labelText: string,
    min?: number,
    max?: number,
    placeholder?: string,
    step?: number,
    accept?: string,
    required: boolean
}

export interface AdCreationpProperties {

}

export class SelectorAdCreation extends SelectorReader {
    public handleChange(e: ChangeEvent<HTMLSelectElement>): void {
        
    }
}