export default interface AdCreatorDto {
    adId: number;
    customerId: number;
    title: string;
    price: number;
    address: string;
    sold: boolean;
    description: string;
    tags: Array<string>;
    adTypeId: number;
    shape: number;
    visibility: number;
    images: string[];
}
