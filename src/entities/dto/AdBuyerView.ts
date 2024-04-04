/**
 * Same as the one in backend.
 * 
 * @author Achraf
 */
interface AdImage {
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
interface AdBuyerView {
    adTitle?: string;
    adPrice?: number;
    adAddedDate?: Date;
    adShape?: number;
    isAdSold?: boolean;
    adVisibility?: number;
    adDescription?: string;
    adAddress?: string;
    adTypeName?: string;
    adTagsName?: Array<string>;
    adImages?: Array<AdImage>;
    username?: string;
    userLink?: string;
    userIcon?: string;
}