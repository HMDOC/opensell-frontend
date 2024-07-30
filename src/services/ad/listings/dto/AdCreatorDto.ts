export default interface AdCreatorDto {
    adId: number;
    customerId: number;
    title: string;
    price: number;
    address: string;
    isSold: boolean;
    description: string;
    tags: Array<string>;
    adTypeId: number;
    shape: number;
    visibility: number;
    adImagesJson: string;
}
