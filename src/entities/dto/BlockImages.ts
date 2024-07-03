import { AdImage } from "./AdBuyerView";

/**
 * @forRemoval
 * @deprecated
*/
export class BlockImage {
    public isBackend: boolean;
    public link: string;
    public file?: File;
    public idAdImage?: number;

    public static fromBackend(images: Array<AdImage>): Array<BlockImage> {
        return images.map(img => {
            return {isBackend: true, link: img.path, idAdImage: img.idAdImage};
        });
    }
}