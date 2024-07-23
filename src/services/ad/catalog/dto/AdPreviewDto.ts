/**
 * Interface for when the user will see an Ad while browsing the site. 
 * Like a preview of it
 * 
 * @author Davide
 */

export default interface AdPreviewDto {
    id?: number;
    title?: string;
    price?: number;
    shape?: number;
    firstImage?: string;
    isSold?: boolean;
    visibility?: number;
}