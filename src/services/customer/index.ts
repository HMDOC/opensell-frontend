import ProfileDto from "@model/dto/ProfileDto";
import http from "../../http-commons";

export const getCustomerProfileDto = async (username? : String) => {
    return await http.get<ProfileDto>(`/user/${username}`);
}