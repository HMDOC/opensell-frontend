import { ChangeEvent, PureComponent, ReactElement, ReactNode, RefObject, createRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdToModif, adModification, adModificationImageOrTags } from "../../services/AdService";
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

const SIMPLE: Array<SimpleInputProps> = [
    {
        name: "title",
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
        name: "price",
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
        name: "adType",
        type: InputType.DEFAULT,
        modifType: ModifType.AD_TYPE,
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
        name: "address",
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
        name: "isSold",
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
        name: "description",
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
        name: "visibility",
        options: VISIBILITY_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.VISIBILITY, value, idAd)
        }
    },
    {
        name: "shape",
        options: SHAPE_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.SHAPE, value, idAd)
        }
    },
];

interface AdTagsProps {
    tags: Array<string>;
    idAd: number;
    delete(tag: string): void;
    add(tag: string): void;
    reset(tags: Array<string>): void;
}

// Faire un gros map avec ton les types d'inputs et il va avoir un if terner pour savoir est-ce que c'est un selector, un input ou autres
class AdTags extends PureComponent<AdTagsProps> {
    // These two field are to save the old value for when we trying to reset.
    public isFirstChange: boolean = true;
    public tagSaveForReset: Array<string> = [];
    
    public asUserChangeAd = false;

    public state = {
        error: HtmlCode.SUCCESS,
        isEditing: false
    };

    public changeAsUserChangeAd(value: boolean) {
        if(value != this.asUserChangeAd) {
            this.asUserChangeAd = value;
        }
    }

    public changeIsEditing(value: boolean) {
        if(this.state.isEditing != value) this.setState({isEditing : value});
    }

    public inputChange(e: any): void {
        if (this.isFirstChange) {
            this.isFirstChange = false;
            this.tagSaveForReset = this.props.tags;
        }

        if (!e.currentTarget.value) {
            if (this.state.error !== HtmlCode.LENGTH_EMPTY) this.setState({ error: HtmlCode.LENGTH_EMPTY });
        }

        else {
            if (!this.props.tags.includes(e.currentTarget.value)) {
                this.setState({ error: HtmlCode.SUCCESS });
                this.props.add(e.target.value);
                this.changeAsUserChangeAd(true);
            } else {
                if (this.state.error !== HtmlCode.UNIQUE_FAILED) this.setState({ error: HtmlCode.UNIQUE_FAILED });
            }
        }

        e.currentTarget.value = "";
    }

    public save() {
        if(this.asUserChangeAd) {
            adModificationImageOrTags(this.props.tags, this.props.idAd, false).then(res => {
                if (res?.data == HtmlCode.SUCCESS) {
                    this.tagSaveForReset = this.props.tags;
                    this.reset();
                }
            });
        } else {
            this.setState({error : HtmlCode.VALUE_AS_NOT_CHANGE})
        }
    }

    public reset() {
        this.props.reset(this.tagSaveForReset);
        this.isFirstChange = true;
        this.changeIsEditing(false);
        this.changeAsUserChangeAd(false);
        this.setState({error : HtmlCode.SUCCESS});
    }

    public deleteTag(tag: string) {
        this.changeIsEditing(true);
        this.props.delete(tag);
        this.changeAsUserChangeAd(true);
    }

    public getError(): string {
        switch (this.state.error) {
            case HtmlCode.LENGTH_EMPTY: return " cannot be empty";
            case HtmlCode.UNIQUE_FAILED: return " already exists";
            case HtmlCode.VALUE_AS_NOT_CHANGE: return " as no value changed."
        }
    }

    public render(): ReactNode {
        return (
            <>
                <label>{"adTags"} {this.getError()}</label>
                <br />

                <input onFocus={() => this.changeIsEditing(true)} onDoubleClick={(e) => this.inputChange(e)} name="adTags" />
                <br />
                <br />

                {this.props.tags?.map((value, index) => (
                    <button onDoubleClick={() => { this.deleteTag(value) }} key={`${index}`}>{value}</button>
                ))}
                <br />
                <br />

                {this.state.isEditing ?
                    (
                        <>
                            <button onClick={() => this.save()}>save</button>
                            <button onClick={() => this.reset()}>cancel</button>
                        </>
                    ) : (
                        <></>
                    )
                }
                <br />
                <br />
            </>
        );
    }
}

class ImageObject {
    public isPath: boolean;
    public object: any;

    constructor(object: any, isPath: boolean) {
        this.object = object;
        this.isPath = isPath;
    }

    public static fromPath(filePath: string): ImageObject {
        return new ImageObject(filePath, true);
    }

    public static fromFile(file: File): ImageObject {
        return new ImageObject(file, false);
    }

    public static fromMultipleFile(fileList: FileList): Array<ImageObject> {
        let fileArray = Array.from(fileList);
        return fileArray?.map(file => ImageObject.fromFile(file));

    }

    public static fromStringArray(imagesLink?: Array<string>) {
        return imagesLink?.map(link => ImageObject.fromPath(link));
    }
}

class AdImages extends PureComponent<{ images: Array<ImageObject> }> {
    public objectUrls: Array<string> = [];

    public addUrl(file: any): any {
        let url = URL.createObjectURL(file);
        this.objectUrls.push(url);
        return url;
    }

    public state = {
        images: this.props.images
    };

    public componentWillUnmount(): void {
        for (let url of this.objectUrls) URL.revokeObjectURL(url);
    }

    public handleChange(e: ChangeEvent<HTMLInputElement>): void {
        this.setState({ images: this.state.images.concat(ImageObject.fromMultipleFile(e.target.files)) });
        e.target.value = null;
    }

    public getFiles(): { multipartFiles: Array<File>, fileSpots: Array<number>, oldImages: Array<{ path: string, spot: number }> } {
        let fileSpots = [];
        let oldImages = [];
        let multipartFiles = [];

        let positionCounter = 0;
        this.state.images.forEach(image => {
            if (image.isPath) {
                oldImages.push({ path: image.object, spot: positionCounter });
            } else {
                multipartFiles.push(image.object);
                fileSpots.push(positionCounter);
            }

            positionCounter++;
        });

        return { multipartFiles, fileSpots, oldImages };
    }

    // Dealing with Image
    public render(): ReactNode {
        console.log(this.state.images)
        return (
            <>
                <label>adImages:</label>
                <br />
                <input onChange={(e) => this.handleChange(e)} type="file" multiple />
                <br />
                <br />
                {this.state.images?.map((image, index) => (
                    image.isPath ?
                        (
                            <img style={{ width: "250px" }} key={`image-${index}`} src={image.object} />

                        ) : (
                            <img style={{ width: "250px" }} key={`image-${index}`} src={this.addUrl(image.object)} />
                        )
                ))}
                <br />
                <br />

            </>
        );
    }
}


// { name: "images", multiple: true, reference: createRef(), isFile: true },
export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [ad, setAd] = useState<AdModifView>(undefined);
    const navigate = useNavigate();
    const [adImagesPath, setAdImagesPath] = useState<Array<string>>();
    var adImagesRef: RefObject<AdImages> = useRef(null);
    const [adTags, setAdTags] = useState<Array<string>>(undefined);

    useEffect(() => {
        getAdToModif(link).then(res => {
            // il faut aussi gérer les anciens images.
            if (res?.data) {
                setAdImagesPath(res?.data?.adImagesPath);
                setAd(res?.data);
                setAdTags(res?.data.adTags);
            }

            else navigate("/not-found");
        });
    }, []);

    function deleteElement(value: string) {
        setAdTags(adTags.filter((tag) => tag !== value));
    }

    function addElement(value: string) {
        setAdTags([...adTags, value]);
    }

    function resetAdTagsState(tags: Array<string>) {
        setAdTags(tags);
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

                <AdImages ref={adImagesRef} images={ImageObject.fromStringArray(adImagesPath)} />

                <AdTags add={addElement} delete={deleteElement} idAd={ad?.idAd} tags={adTags} reset={resetAdTagsState} />

                {
                    SELECTS.map((value, index) => (
                        <SelectorReader
                            key={`select-${index}`}
                            idAd={ad?.idAd}
                            value={ad?.[value?.name]}
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