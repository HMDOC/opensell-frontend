import { FormEvent } from "react";

export const getFormData = (event: FormEvent<HTMLFormElement>): FormData => {
    if (event.currentTarget instanceof HTMLFormElement) return new FormData(event.currentTarget);
    else return new FormData(event.target as HTMLFormElement);
}

export const getFormDataAsArray = (formData: FormData):{fieldName: string, value: string}[] => {
    let tempData: {fieldName: string, value: string}[] = [];
    formData.forEach((value: string, key: string) => {
        tempData.push({fieldName: key, value: value})
    });
    return tempData;
}