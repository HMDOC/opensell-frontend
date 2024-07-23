import { AdTag } from "../model/dto/AdTag";
import { AdType } from "../model/dto/AdType";
import http from "../http-commons";

const REQUEST_MAPPING = "/api/ad";

export const getAllAdTypes = async () => {
    return await http.get<Array<AdType>>(`${REQUEST_MAPPING}/get-all-ad-type`);
};

export const getAllAdTags = async () => {
    return await http.get<Array<AdTag>>(`${REQUEST_MAPPING}/get-all-ad-tag`);
};