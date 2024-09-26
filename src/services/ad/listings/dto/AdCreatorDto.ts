export default interface AdCreatorDto {
    adId: number;
    customerId: number;
    title: string;
    price: number;
    address: string;
    sold: boolean;
    description: string;
    tags: Array<string>;
    adCategoryId: string;
    shape: number;
    visibility: number;
    images: string[];
}
