import { AdCreationImageData } from "./AdCreationImageData";

export interface AdCreationData {
    adTypeId: number,
    customerId: number, //
    price: number, //
    shape: number, //
    visibility: number, //
    title: string, //
    description: string, //
    address: string, //
    reference: string, //
    tags: string[], //
    imageData: AdCreationImageData[]

}