interface AdModifView {
    idAd: number;
    title: string;
    price: number;
    shape: number;
    isSold: boolean;
    visibility: number;
    description: string;
    reference: string
    address: string;
    link: string
    adType: string;
    adTags: Array<string>;
    adImagesPath: Array<string>;
}