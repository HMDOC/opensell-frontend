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
    adTags: Set<string>;
    adImagesPath: Array<string>;
}