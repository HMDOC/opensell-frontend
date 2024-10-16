
export const RegexCode: {[field: string]: RegExp} = {
    USERNAME: /^([a-zA-Z0-9_]){1,30}$/g,
    FIRST_LAST_NAME: /^([a-zA-Z]){1,15}((-|\\s)[a-zA-Z]{1,15}){0,2}$/g,
    PWD: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/g,
    URL: /(https?:\/\/)?(www\.)?(?=[a-zA-Z0-9]{1,256}\.)[a-zA-Z0-9]+(\.[a-z]{2,5}){1,3}(\/[a-zA-Z0-9-\._~:\/?#\[\]@!$&'\(\)\*\\+,;=]*)?/g,
    EMAIL: /^(?=.{1,64}@)[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)*@[a-z]+(\.[a-zA-Z]+)+[a-zA-Z]$/g,
    PHONE_NUMBER: /^\d{3}-\d{3}-\d{4}$/g,
    LIMIT80: /^.{0,80}$/g,
    LIMIT5000: /^.{0,5000}$/g
}

export function verify(inputValue: string, code: RegExp): boolean {
    return new RegExp(code).test(inputValue);
}