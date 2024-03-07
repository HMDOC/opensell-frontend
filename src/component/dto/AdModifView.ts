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
    adTypeName: string;
    adTagsName: Set<String>;
    adImagesPath: Array<String>;
}