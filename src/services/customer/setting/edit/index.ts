import http from "../../../../http-commons"
import { OtherInformationDto } from "./dto/OtherInformationDto";
import { PasswordDto } from "./dto/PasswordDto";

const REQUEST_MAPPING = "/api/customer/setting/edit";

export enum CMModalType {
    EMAIL,
    PASSWORD,
    BASIC_CHANGES
}

export const changeIcon = async (id: number, iconFile?: File) => {
    let formData: FormData = new FormData();
    if(iconFile) formData.append("iconFile", iconFile);

    return await http.patch(`${REQUEST_MAPPING}/${id}/icon`, formData);
}

export function changeEmail(id: number, email: string, confirmEmail: string) {
    return http.patch(`${REQUEST_MAPPING}/${id}/email`, undefined, { params: { id, email, confirmEmail } })
}

export function changeOtherInformation(id: number, otherInformation: OtherInformationDto) {
    return http.patch(`${REQUEST_MAPPING}/${id}/other-information`, undefined, { params: otherInformation });
}

export function changePassword(id: number, passwordDto: PasswordDto) {
    return http.patch(`${REQUEST_MAPPING}/${id}/password`, undefined, { params: { id, ...passwordDto } });
}