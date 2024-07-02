export class FrontendImage {
    file: File;
    blobUrl: string;

    constructor(file: File, blobUrl: string) {
        this.file = file;
        this.blobUrl = blobUrl;
    }
}

export interface ImageBox {
    id?: number;

    /* The path or the file. */
    content: FrontendImage | string;

    // The spot will be reset at the end before sending.
    spot?: number;
}