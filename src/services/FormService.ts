import { FormEvent } from "react";

export const getFormData = (event: FormEvent<HTMLFormElement>): FormData => {
    return new FormData(event.currentTarget);
}

export const getFormDataAsArray = (formData: FormData):{fieldName: string, value: string}[] => {
    let tempData: {fieldName: string, value: string}[] = [];
    formData.forEach((value: string, key: string) => {
        tempData.push({fieldName: key, value: value})
    });
    return tempData;
}