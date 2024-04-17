import { ChangeEvent, PureComponent, ReactNode } from "react";
import { AdImage } from "../../entities/dto/AdBuyerView";
import { saveAdImages } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";
import "../../css/component/page/AdModif.css";

export interface CreationImage {
    file: File;
    id: string;
}

interface AdImagesProps {
    // Only Update
    images?: Array<AdImage>;
    removeImage?(url: string): void;
    idAd?: number;
    isModification?: boolean;
    reset?(backup: Array<AdImage>): void;
    error: string;
    setError(error: string): void;

    // Only for Creation
    creationImages?: Array<CreationImage>;
    updateCreationImages?(creationImages: Array<CreationImage>, isDelete?: boolean): void;
}

export class AdImages extends PureComponent<AdImagesProps> {
    public backup: Array<AdImage> = undefined;
    public urlToDelete: Set<string> = new Set();

    public state = {
        imgsToDelete: new Array<number>(),
        temporaryFileUrls: new Array<{ path: string, isOldImg: boolean, file: File }>(),
        isEditing: false
    };

    public addUrls(files: Array<File>): void {
        let imgObjects = [];
        let tmpCreationImage: Array<CreationImage> = [];

        files.forEach(file => {
            let url = URL.createObjectURL(file);
            imgObjects.push({ path: url, isOldImg: false, file: file });

            if (!this.props.isModification) {
                tmpCreationImage.push({ file: file, id: url });
            }
        });

        if (!this.props.isModification) {
            this.props.updateCreationImages(tmpCreationImage, false);
        }

        this.setState({ temporaryFileUrls: [...this.state.temporaryFileUrls, ...imgObjects] })
    }

    public getUrls = (): Array<{ path: string, isOldImg: boolean }> => {
        let urlArray = [];

        if (this.props.isModification) {
            this.props.images?.forEach(img => {
                urlArray.push({ path: img.path, isOldImg: true });
            })

            return [...urlArray, ...this.state.temporaryFileUrls];
        }

        else {
            return [...this.state.temporaryFileUrls];
        }
    }

    public componentWillUnmount(): void {
        for (let url of Array.from(this.urlToDelete)) URL.revokeObjectURL(url);
    }

    public setIsEditing(isEditing: boolean = true): void {
        if (this.state.isEditing != isEditing) {
            this.setState({ isEditing });
        }
    }

    public getError(isDelete = false): boolean {
        let error = "";
        console.log("IMG LENGTH : " + this.props.images);

        if (this.props.images.length == 1 && isDelete) {
            error = " need to be at least one";

            if (error != this.props.error) {
                this.props.setError(error);
            }

            return true;
        }


        else {
            if (error) {
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

        e.target.value = null;
    }

    public deleteImg(currentImg: { path: string, isOldImg: boolean }): void {
        this.setIsEditing();
        this.saveBackup();

        if (!this.getError(true)) {

            if (currentImg.isOldImg) {
                let completeImg = this.props.images.find(img => img.path == currentImg.path);
                this.props.removeImage(completeImg.path);

                this.setState({
                    imgsToDelete: [...this.state.imgsToDelete, this.props.images.find(img => img.path == currentImg.path).idAdImage]
                });
            }

            else {
                let imgDelete = this.state.temporaryFileUrls.find(img => img.path == currentImg.path);

                this.setState({ temporaryFileUrls: this.state.temporaryFileUrls.filter(img => img != imgDelete) })

                if (!this.props.isModification) {
                    this.props.updateCreationImages([{ file: null, id: currentImg.path }], true)
                }

                this.urlToDelete.add(currentImg.path);
            }
        }
    }

    public save() {
        if (!this.getError()) {
            saveAdImages(this.state.temporaryFileUrls.map(img => img.file),
                this.props.idAd,
                true, this.state.imgsToDelete).then(res => {
                    if (res?.data) {
                        this.props.reset(res?.data);
                        this.saveBackup(res?.data, true)
                        this.setState({ temporaryFileUrls: [], isEditing: false });
                    }
                });
        }
    }

    public saveBackup(backup: Array<AdImage> = this.props.images, saved: boolean = false) {
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
                {this.getUrls()?.map(img => (
                    <img onDoubleClick={() => this.deleteImg(img)} className="adModifImages" key={createRandomKey()} src={img.path} />
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