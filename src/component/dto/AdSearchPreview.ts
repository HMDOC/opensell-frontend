/**
 * Interface for when the user will see an Ad while searching for it. Like a preview of it
 * 
 * @author Davide
 */

interface AdSearchPreview {
    adTitle? : string;
    adPrive? : number;
    adShape? : number;
    isAdSold? : boolean;
    adLink? : string;
    adFirstImagePath? : string;
}