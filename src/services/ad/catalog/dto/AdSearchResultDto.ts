/**
 * Interface for the search function in catalog. 
 * The backend returns a Page object. 
 * I omitted most of the variables in the class and only kept the ones I needed in this interface.
 * 
 * @author Davide
 */

import AdPreviewDto from "./AdPreviewDto";

export default interface AdSearchResultDto {
    content: AdPreviewDto[];
    totalPages : number;
}