

/**
 *
 * @author Olivier Mansuy
 * @description rational expressions for Attributes
 */
export enum RegexCode {
    USERNAME = "^([a-zA-Z0-9_]){1,30}$",
    FIRST_NAME = "^([a-zA-Z]){1,15}((-|\\s)[a-zA-Z]{1,15}){0,2}",
    LAST_NAME = "^([a-zA-Z]){1,15}((-|\\s)[a-zA-Z]{1,15}){0,2}",
    PWD = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}",
    URL = "(https?:\\/\\/)?(www\\.)?(?=[a-zA-Z0-9]{1,256}\\.)[a-zA-Z0-9]+(\\.[a-z]{2,5}){1,3}(\\/[a-zA-Z0-9-\\._~:\\/?#\\[\\]@!$&'\\(\\)\\*\\+,;=]*)?",
    EMAIL = "^(?=.{1,64}@)[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9]+)*@[a-z]+(\\.[a-zA-Z]+)+[a-zA-Z]$",
    PHONE_NUMBER = "^((\\(\\d{3}\\))|(\\d{3}))((\\s\\d{3})|(-\\d{3}))(-(\\d{4})|(\\s\\d{4}))"
}

export function verify(inputValue: string, code: RegexCode): boolean {
    return new RegExp(code).test(inputValue);
}