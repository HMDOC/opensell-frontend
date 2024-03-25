import { AxiosResponse } from "axios";
import http from "../http-commons";
import { AdCreationFeedback } from "../entities/dto/adCreation/AdCreationFeedback";
import { AdCreationData } from "../entities/dto/adCreation/AdCreationData";

export const postAd = (adData: AdCreationData): Promise<AxiosResponse<AdCreationFeedback, any>> => {
    return http.post("/ad/ad-creation", adData);
}