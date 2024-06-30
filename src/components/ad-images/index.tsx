import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import { ChangeEvent, PureComponent, ReactNode } from "react";
import { BlockImage } from "../../entities/dto/BlockImages";
import { saveAdImages } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";
import IconLabelError from "../shared/part/IconLabelError";
import "./style.scss";

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

export const SaveCancelButton = (props: { save(): void, cancel(): void }) => {
    return (
        <>
            <button className="ad-image-action" onClick={props.save}>save</button>
            <button className="ad-image-action" onClick={props.cancel}>cancel</button>
        </>
    );
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
        if (this.state.isEditing !== isEditing) {
            this.setState({ isEditing });
        }
    }

    public getError(isDelete = false): boolean {
        let error = "";

        if (this.props.images.length <= 2 && isDelete) {
            error = "You need to have at least two images.";

            if (error !== this.props.error) {
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
                this.props.setImages(this.props.images.filter(img => img !== currentImg));

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
                <IconLabelError title="Images" iconProp={faImage}></IconLabelError>
                {!!this.props.error ? (
                    <p style={{ color: "red" }}>{this.props.error}</p>
                ) : (<></>)}
                <label htmlFor="ad-image-input">
                    <Button component="span" variant="contained">
                        upload
                    </Button>
                </label>


                <input
                    id="ad-image-input"
                    onChange={(e) => this.handleChange(e)}
                    type="file"
                    multiple
                    accept="image/png"
                    hidden
                />

                <div>
                    {this.props.images?.map(img => (
                        <img onDoubleClick={() => this.deleteImg(img)} className="ad-image" key={createRandomKey()} src={img.link} />
                    ))}

                    {this.props.isModification && this.state.isEditing ?
                        (
                            <>
                                <br />
                                <br />
                                <SaveCancelButton save={() => this.save()} cancel={() => this.cancel()} />
                            </>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </>
        );
    }
}