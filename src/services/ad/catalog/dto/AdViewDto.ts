import AdShape from "@model/enums/AdShape";
import { AdType } from "../../../../model/dto/AdType";
import { AdVisibility } from "@model/enums/AdVisibility";
import AdImage from "@model/AdImage";

/**
 * Interface that contain the essential data that a user need to see
 * when clicking on ad.
 * 
 * @author Achraf
 */
export default interface AdViewDto {
    adTitle?: string;
    adPrice?: number;
    adAddedDate?: Date;
    adShape?: AdShape;
    isAdSold?: boolean;
    adVisibility?: AdVisibility;
    adDescription?: string;
    adAddress?: string;
    adType?: AdType;
    adTagsName?: Array<string>;
    adImages?: Array<AdImage>;
	userPhone?: string;
    username?: string;
    userIcon?: string;
}