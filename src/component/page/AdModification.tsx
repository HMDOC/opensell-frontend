import { ChangeEvent, PureComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdToModif, adModification, adModificationTags, saveAdImages } from "../../services/AdService";
import { HtmlCode } from "../../services/verification/HtmlCode";
import "../../css/component/page/AdModif.css";
import {
    InputType,
    ModifType,
    SelectorReader,
    SelectorReaderProps, SHAPE_ARRAY,
    SimpleInput,
    SimpleInputProps, VISIBILITY_ARRAY,
} from "../shared/SharedAdPart";
import { AdTags } from "../shared/AdTags";
import { createRandomKey } from "../../services/RandomKeys";
import AdTypeSelect from "../shared/AdTypeSelect";
import { AdModifView } from "../../entities/dto/AdModifView";
import { AdImage } from "../../entities/dto/AdBuyerView";
import { AdType } from "../../entities/dto/AdType";

const SIMPLE: Array<SimpleInputProps> = [
    {
        name: "adTitle",
        type: InputType.DEFAULT,
        modifType: ModifType.TITLE,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "reference",
        type: InputType.DEFAULT,
        modifType: ModifType.REFERENCE,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "adPrice",
        type: InputType.DEFAULT,
        modifType: ModifType.PRICE,
        isNumber: true,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "adAddress",
        type: InputType.DEFAULT,
        modifType: ModifType.ADDRESS,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "isAdSold",
        type: InputType.ONE_CHECKBOX,
        modifType: ModifType.IS_SOLD,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "adDescription",
        type: InputType.TEXTARIA,
        modifType: ModifType.DESCRIPTION,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }
];

const SELECTS: Array<SelectorReaderProps> = [
    {
        name: "adVisibility",
        options: VISIBILITY_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.VISIBILITY, value, idAd)
        }
    },
    {
        name: "adShape",
        options: SHAPE_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.SHAPE, value, idAd)
        }
    },
];

interface AdImagesProps {
    images: Array<AdImage>;
    removeImage(url: string): void;
    idAd: number;
    isModification?: boolean;
    reset(backup: Array<AdImage>): void;

}

class AdImages extends PureComponent<AdImagesProps> {
    public backup: Array<AdImage> = undefined;
    
    public state = {
        imgsToDelete: "",
        temporaryFileUrls: new Array<{path: string, isOldImg: boolean, file: File}>()
    };

    public addUrls(files: Array<File>): void {
        let imgObjects = [];
        
        files.forEach(file => {
            imgObjects.push({path: URL.createObjectURL(file), isOldImg: false, file: file});
        });

        this.setState({temporaryFileUrls: [...this.state.temporaryFileUrls, ...imgObjects]})
    }

    public getUrls = (): Array<{path: string, isOldImg: boolean}> => {
        let urlArray = [];
        
        this.props.images?.forEach(img => {
            urlArray.push({path: img.path, isOldImg: true});
        })

        return [...urlArray, ...this.state.temporaryFileUrls];
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

            URL.revokeObjectURL(imgDelete.path);
        }
    }

    public save() {
        saveAdImages(this.state.temporaryFileUrls.map(img => img.file), this.props.idAd, true, this.state.imgsToDelete);
    }

    public saveBackup() {
        if(!this.backup) {
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


// { name: "images", multiple: true, reference: createRef(), isFile: true },
export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [ad, setAd] = useState<AdModifView>(undefined);
    const navigate = useNavigate();
    const [adTags, setAdTags] = useState<Array<string>>(undefined);
    const [error, setError] = useState<HtmlCode>(HtmlCode.SUCCESS);
    const [adImages, setAdImages] = useState<Array<AdImage>>([]);

    const [oldTags, setOldTags] = useState({
        isOldValueSaved : false,
        tagsForReset: []
    });

    useEffect(() => {
        getAdToModif(link).then(res => {
            // il faut aussi gérer les anciens images.
            if (res?.data) {
                setAd(res?.data);
                setAdTags(res?.data.adTagsName);
                setAdImages(res?.data.adImages);
            }

            else navigate("/not-found");
        });
    }, []);
    
    const [isEditing, setIsEditing] = useState<boolean>(false);
    function registerOldTags() {
        if (!oldTags.isOldValueSaved) {
            setOldTags({tagsForReset : adTags, isOldValueSaved : true});
            console.log(oldTags);
        }

        if (!isEditing) setIsEditing(true);
    }

    function reset(isReset: boolean = true) {
        setOldTags({...oldTags, isOldValueSaved : false});
        if(isReset) setAdTags(oldTags.tagsForReset);
        setIsEditing(false);
        setError(HtmlCode.SUCCESS);
    }

    function save() {
        adModificationTags(adTags, ad?.idAd).then(res => {
            if (res?.data == HtmlCode.SUCCESS) {
                reset(false);
            }
        });
    }

    function addEvent(tag: string) {
        registerOldTags();
        setAdTags([...adTags, tag]);
    }

    function deleteEvent(tag: string) {
        registerOldTags();
        setAdTags(adTags.filter(t => t != tag));
    }

    return (
        <div className="main-background">
            <>
                {SIMPLE.map(value => (
                    <SimpleInput
                        defaultValue={ad?.[value.name]}
                        modifType={value?.modifType}
                        idAd={ad?.idAd}
                        name={value?.name}
                        type={value?.type}
                        isNumber={value?.isNumber}
                        checkValue={(value: any) => { if (value) return HtmlCode.SUCCESS; else if (!value) return HtmlCode.LENGTH_EMPTY; }}
                        getErrorType={(error) => { if (error == 1) return " cannot be empty."; else if (error == 2054) return " is already in use with annother of your ad." }} />
                ))}

                <AdImages
                    idAd={ad?.idAd}
                    images={adImages}
                    reset={(backup) => setAdImages(backup)}
                    removeImage={(path) => setAdImages(adImages.filter(img => img.path != path))}
                    isModification={true}
                />

                <AdTags
                    error={error}
                    setError={setError}
                    tags={adTags}
                    addTag={addEvent}
                    deleteTag={deleteEvent}
                />

                {isEditing ?
                    (
                        <>
                            <button onClick={save}>save</button>
                            <button onClick={() => reset()}>cancel</button>
                            <br />
                            <br />
                        </>
                    ) : (<></>)

                }

                <label>AdType :</label>
                <AdTypeSelect 
                    inputName="AdType" 
                    inputId="adf"
                    isModification
                    selectedIndex={ad?.adType?.idAdType}
                    externalOnChange={(type) => console.log(ad?.adType?.idAdType)} />
                <br />
                <br />
                
                {
                    SELECTS.map(value => (
                        <SelectorReader
                            key={createRandomKey()}
                            idAd={ad?.idAd}
                            defaultValue={ad?.[value?.name]}
                            name={value?.name}
                            options={value?.options}
                            request={value?.request}
                        />
                    ))
                }
            </>
        </div>
    );
}