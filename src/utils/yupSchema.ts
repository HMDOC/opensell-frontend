import { number, string } from "yup";

export function notEmptyWithMaxAndMin(max: number, min: number, label?: string) {
    return string()
        .required(`${label ?? ""} is required.`)
        .max(max, `${label ?? ""} cannot have more than ${max} characters.`)
        .min(min, `${label ?? ""} cannot have less than ${min} characters.`);
}

export function priceWithMinAndMax(max: number, min: number, label?: string) {
    return number()
        // To do not get a error if the user put the input empty
        .transform(cv => isNaN(cv) ? undefined : cv)
        .max(max, `${label ?? ""} cannot be more than ${max}$.`)
        .min(min, `${label ?? ""} cannot be less than ${min}$.`)
        .required(`${label ?? ""} is required.`);
}