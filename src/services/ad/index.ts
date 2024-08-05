import { AdTag } from "@model/dto/AdTag";
import { AdCategory } from "@model/dto/AdCategory";
import http from "../../http-commons";

const REQUEST_MAPPING = "/api/ad";

export const getAllAdCategorys = async () => {
    return await http.get<Array<AdCategory>>(`${REQUEST_MAPPING}/get-all-ad-type`);
};

export const getAllAdTags = async () => {
    return await http.get<Array<AdTag>>(`${REQUEST_MAPPING}/get-all-ad-tag`);
};