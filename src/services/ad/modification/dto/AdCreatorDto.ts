export default class AdCreatorDto {
    public adId: number;
    public customerId: number;
    public title: string;
    public price: number;
    public address: string;
    public isSold: boolean;
    public description: string;
    public tags: Array<string>;
    public adTypeId: number;
    public shape: number;
    public visibility: number;
    public adImagesJson: string;
}
