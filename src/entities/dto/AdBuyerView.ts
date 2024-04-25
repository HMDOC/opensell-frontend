import { AdType } from "./AdType";

export enum AdVisibility {
	PUBLIC,
	PRIVATE,
	LINK_ONLY
}

export enum AdShape {
    NEW,
	LIKE_NEW,
	GOOD,
	USABLE,
    BAD,
    UNKNOWN
}

export const getShapeStr = (shape?: AdShape): string => {
    switch(shape) {
        case AdShape.NEW:
            return "New";
        case AdShape.LIKE_NEW:
            return "Like new";
        case AdShape.GOOD:
            return "Good";
        case AdShape.USABLE:
            return "Usable";
        case AdShape.BAD:
            return "Bad";
        case AdShape.UNKNOWN:
            return "Unknown";
        default:
            return undefined;
    }
}

/**
 * Same as the one in backend.
 * 
 * @author Achraf
 */
export interface AdImage {
    idAdImage: number;
    path: string; 
    spot: number; 
    isLocal: boolean;
}

/**
 * Interface that contain the essential data that a user need to see
 * when clicking on ad.
 * 
 * @author Achraf
 */
export interface AdBuyerView {
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
    userLink?: string;
    userIcon?: string;
}