import AdShape from "@model/enums/AdShape";
import { AdCategory } from "@model/dto/AdCategory";
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
    adCategory?: AdCategory;
    adTagsName?: Array<string>;
    adImages?: Array<string>;
	userPhone?: string;
    username?: string;
    userIcon?: string;
}