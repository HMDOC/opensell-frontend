import { AdType } from "./AdType";

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
    adShape?: number;
    isAdSold?: boolean;
    adVisibility?: number;
    adDescription?: string;
    adAddress?: string;
    adType?: AdType;
    adTagsName?: Array<string>;
    adImages?: Array<AdImage>;
    username?: string;
    userLink?: string;
    userIcon?: string;
}