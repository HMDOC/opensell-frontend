import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";

export default interface ProfileDto {
    firstName? : string;
    lastName? : string;
    bio? : string;
    iconPath? : string;
    username: string;
    joinedDate: string;
    ads: Array<AdPreviewDto>;
}