import { ChangeEvent, PureComponent, ReactNode } from "react";
import { AdImage } from "../../entities/dto/AdBuyerView";
import { saveAdImages } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";

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

    // Only for Creation
    creationImages?: Array<CreationImage>;
    updateCreationImages?(id: string, isDelete: boolean, file?: File): void;
}

export class AdImages extends PureComponent<AdImagesProps> {
    public backup: Array<AdImage> = undefined;
    
    public state = {
        imgsToDelete: "",
        temporaryFileUrls: new Array<{path: string, isOldImg: boolean, file: File}>()
    };

    public addUrls(files: Array<File>): void {
        let imgObjects = [];
        files.forEach(file => {
            let url = URL.createObjectURL(file);
            imgObjects.push({path: url, isOldImg: false, file: file});

            if(!this.props.isModification) {
                this.props.updateCreationImages(url, false, file);
            }
        });

       

        this.setState({temporaryFileUrls: [...this.state.temporaryFileUrls, ...imgObjects]})
    }

    public getUrls = (): Array<{path: string, isOldImg: boolean}> => {
        let urlArray = [];
        
        if(this.props.isModification) {
            this.props.images?.forEach(img => {
                urlArray.push({path: img.path, isOldImg: true});
            })

            return [...urlArray, ...this.state.temporaryFileUrls];
        }

        else {
            return [...this.state.temporaryFileUrls];
        }
    }

    public componentWillUnmount(): void {
        for (let url of this.state.temporaryFileUrls) URL.revokeObjectURL(url.path);
    }

    public handleChange(e: ChangeEvent<HTMLInputElement>): void {
        this.saveBackup();

        let currentFiles: Array<File> = Array.from(e.target.files);
        this.addUrls(currentFiles);

        e.target.value = null;
    }

    public deleteImg(currentImg: {path: string, isOldImg: boolean}): void {
        this.saveBackup();

        if(currentImg.isOldImg) {
            let completeImg = this.props.images.find(img => img.path == currentImg.path);
            this.props.removeImage(completeImg.path);

            this.setState({imgsToDelete : this.state.imgsToDelete.concat(
                `${this.props.images.find(img => img.path == currentImg.path).idAdImage},`
            )});
        }

        else {
            let imgDelete = this.state.temporaryFileUrls.find(img => img.path == currentImg.path);

            this.setState({temporaryFileUrls: this.state.temporaryFileUrls.filter(img => img != imgDelete)})

            if(!this.props.isModification) {
                this.props.updateCreationImages(currentImg.path, true)
            }

            URL.revokeObjectURL(imgDelete.path);
        }
    }

    public save() {
        saveAdImages(this.state.temporaryFileUrls.map(img => img.file), this.props.idAd, true, this.state.imgsToDelete);
    }

    public saveBackup() {
        if(this.props.isModification && !this.backup) {
            this.backup = this.props.images;
        }
    }

    public cancel() {
        if(this.backup) {
            this.props.reset(this.backup);
            this.setState({temporaryFileUrls: [], imgsToDelete: ""});
        }
    }

    // Dealing with Image
    public render(): ReactNode {
        console.log(this.state.imgsToDelete);

        return (
            <>
                <label>adImages :</label>
                <br />
                <input onChange={(e) => this.handleChange(e)} type="file" multiple />
                <br />
                <br />
                {this.getUrls()?.map(img => (
                    <img onDoubleClick={() => this.deleteImg(img)} style={{ width: "250px" }} key={createRandomKey()} src={img.path} />
                ))}
                <br />
                <br />
                
                {this.props.isModification ?
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