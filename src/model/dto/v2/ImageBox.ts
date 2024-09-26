export class FrontendImage {
    file: File;
    blobUrl: string;

    constructor(file: File, blobUrl: string) {
        this.file = file;
        this.blobUrl = blobUrl;
    }
}

export type ImageBox = FrontendImage | string;