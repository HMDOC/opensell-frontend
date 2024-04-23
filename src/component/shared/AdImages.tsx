import { ChangeEvent, PureComponent, ReactNode } from "react";
import { saveAdImages } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";
import "../../css/component/page/AdModif.css";
import { BlockImage } from "../../entities/dto/BlockImages";

interface AdImagesProps {
    images: Array<BlockImage>;
    setImages(blockImages: Array<BlockImage>): void;
    removeImage(link: string): void;
    idAd?: number;
    isModification?: boolean;
    reset?(backup: Array<BlockImage>): void;
    error: string;
    setError(error: string): void;
}

export class AdImages extends PureComponent<AdImagesProps> {
    public backup?: Array<BlockImage>;

    public state = {
        imgsToDelete: new Array<number>(),
        isEditing: false
    };

    public addUrls(files: Array<File>): void {
        this.props.setImages([...this.props.images,
        ...files.map(file => {
            return { file, isBackend: false, link: URL.createObjectURL(file) };
        })]);
    }

    public componentWillUnmount(): void {
        for (let img of this.props.images) {
            if (img.isBackend) {
                URL.revokeObjectURL(img.link);
            }
        }
    }

    public setIsEditing(isEditing: boolean = true): void {
        if (this.state.isEditing != isEditing) {
            this.setState({ isEditing });
        }
    }

    public getError(isDelete = false): boolean {
        let error = "";

        if (this.props.images.length == 1 && isDelete) {
            error = " need to be at least one";

            if (error != this.props.error) {
                this.props.setError(error);
            }

            return true;
        }

        else {
            if (this.props.error) {
                this.props.setError("");
            }
            return false;
        }
    }

    public handleChange(e: ChangeEvent<HTMLInputElement>): void {
        this.setIsEditing();
        this.saveBackup();

        let currentFiles: Array<File> = Array.from(e.target.files);
        this.addUrls(currentFiles);
        
        this.props.setError("");
        e.target.value = null;
    }

    public deleteImg(currentImg: BlockImage): void {
        this.setIsEditing();
        this.saveBackup();

        if (!this.getError(true)) {
            if (currentImg.isBackend) {
                this.props.removeImage(currentImg.link);

                this.setState({
                    imgsToDelete: [...this.state.imgsToDelete, currentImg?.idAdImage]
                });
            }

            else {
                this.props.setImages(this.props.images.filter(img => img != currentImg));
                
                // When the img is deleted we revoke the URL, otherwise we 
                // do a for each in the componentUnMount for each Images
                URL.revokeObjectURL(currentImg.link);
            }
        }
    }

    public save() {
        if (!this.getError()) {
            saveAdImages(this.props.images.map(img => img.file),
                this.props.idAd,
                true, this.state.imgsToDelete).then(res => {
                    if (res?.data) {
                        this.props.reset(BlockImage.fromBackend(res?.data));
                        this.saveBackup(BlockImage.fromBackend(res?.data), true)
                        this.setState({ temporaryFileUrls: [], isEditing: false });
                    }
                });
        }
    }

    public saveBackup(backup: Array<BlockImage> = this.props.images, saved: boolean = false) {
        if (this.props.isModification && (!this.backup || saved)) {
            this.backup = backup;
        }
    }

    public cancel() {
        if (this.backup) {
            this.props.reset(this.backup);
            this.setState({ temporaryFileUrls: [], imgsToDelete: "" });
            this.setIsEditing(false);
            this.props.setError("");
        }
    }

    // Dealing with Image
    public render(): ReactNode {
        return (
            <>
                <label>adImages <span style={{ color: "red" }}>{this.props.error ? this.props.error : ""}</span></label>
                <br />
                <input onChange={(e) => this.handleChange(e)} type="file" multiple />
                <br />
                <br />
                {this.props.images?.map(img => (
                    <img onDoubleClick={() => this.deleteImg(img)} className="adModifImages" key={createRandomKey()} src={img.link} />
                ))}
                <br />
                <br />

                {this.props.isModification && this.state.isEditing ?
                    (
                        <>
                            <button onClick={() => this.save()}>save</button>
                            <button onClick={() => this.cancel()}>cancel</button>
                            <br />
                            <br />
                        </>
                    ) : (
                        <></>
                    )
                }
            </>
        );
    }
}