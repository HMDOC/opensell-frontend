/**
 * Interface that contain the essential data that a user need to see
 * when clicking on ad.
 * 
 * @author Achraf
 */
interface AdBuyerView {
    adTitle? : string; 
    adPrice? : number; 
    adAddedDate? : Date; 
    adShape? : number;
    isAdSold? : boolean;
    adVisibility? : number;
    adDescription? : string;
    adAddress? : string;
    adTypeName? : string;
    adTagsName? : Set<string>;
    adImagePath? : Array<string>;
    adLink? : string;
    username? : string;
    userLink? : string;
    userIcon? : string;
}