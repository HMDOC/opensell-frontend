import { ChangeEvent, PureComponent, ReactElement, ReactNode, RefObject, createRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdToModif, adModification } from "../../services/AdService";
import Loading from "../part/Loading";
import { HtmlCode } from "../../services/verification/HtmlCode";
import {
    InputType,
    ModifType,
    SelectorReader,
    SelectorReaderProps, SHAPE_ARRAY,
    SimpleInput,
    SimpleInputProps, VISIBILITY_ARRAY,
} from "../shared/SharedAdPart";
import "../../css/component/page/AdModif.css";

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

// Faire un gros map avec ton les types d'inputs et il va avoir un if terner pour savoir est-ce que c'est un selector, un input ou autres
class AdTags extends PureComponent<SimpleInputProps> {
    public state = {
        adTags: Array.from([].concat(this.props.defaultValue)),
        error: 0
    };

    public inputChange(e: ChangeEvent<HTMLInputElement>): void {
        if (!e.currentTarget.value) {
            if (this.state.error !== 1) this.setState({ error: 1 });
        }

        else {
            if (!this.state.adTags.includes(e.currentTarget.value)) {
                this.setState({ adTags: [...this.state.adTags, e.currentTarget.value], error: 0 });
            } else {
                if (this.state.error !== 2) this.setState({ error: 2 });
            }
        }

        e.currentTarget.value = "";
    }

    public getError(error: number, label: string): string {
        switch (error) {
            case 0: return label;
            case 1: return "Tag cannot be empty";
            case 2: return "Tag already exists";
        }
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.getError(this.state.error, "adTags")}</label>
                <br />

                <input onDoubleClick={this.inputChange.bind(this)} name="adTags" />
                <br />
                <br />

                {this.state.adTags?.map((value, index) => (
                    <button onDoubleClick={() => { let adTagsChange = this.state.adTags.filter((tag) => tag !== value); this.setState({ adTags: adTagsChange }); }} key={`${index}`}>{value}</button>
                ))}

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
                <label>adImages: </label>
                <br />
                <input onChange={this.handleChange.bind(this)} type="file" multiple />
                <br />
                <br />
                {this.state.images?.map((image, index) => (
                    image.isPath ?
                        (
                            <img style={{width : "250px"}} key={`image-${index}`} src={image.object} />

                        ) : (
                            <img style={{width : "250px"}} key={`image-${index}`} src={this.addUrl(image.object)} />
                        )
                ))}
                <br />
                <br />

            </>
        );
    }
}

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
                return 0;
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
                return 0;
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
                return 0;
            }
        }
    }, {
        name: "adType (TO FINISH BACKEND)",
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
                return 0;
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
                return 0;
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
                return 0;
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
                return 0;
            }
        }
    }
];

// { name: "images", multiple: true, reference: createRef(), isFile: true },
export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [isloading, setIsLoading] = useState<boolean>(true);
    const [ad, setAd] = useState<AdModifView>(undefined);
    const navigate = useNavigate();
    const [adTagsStr, setAdTagsStr] = useState<Set<string>>();
    const [adImagesPath, setAdImagesPath] = useState<Array<string>>();
    var adImagesRef: RefObject<AdImages> = useRef(null);

    useEffect(() => {
        getAdToModif(link).then(res => {
            // il faut aussi gérer les anciens images.
            if (res?.data) {
                setIsLoading(false);
                setAdTagsStr(res?.data?.adTags);
                setAdImagesPath(res?.data?.adImagesPath);
                setAd(res?.data);
            }

            else navigate("/not-found");
        });
    }, []);

    var adTagsRef: RefObject<HTMLInputElement> = createRef();

    return (
        <div>
            {isloading ?
                (
                    <Loading />
                ) : (
                    <>
                        {SIMPLE.map(value => (
                            <SimpleInput
                                defaultValue={ad?.[value.name]}
                                modifType={value.modifType}
                                idAd={ad.idAd}
                                name={value.name}
                                type={value.type}
                                isNumber={value.isNumber}
                                checkValue={(value: any) => { if (value) return HtmlCode.SUCCESS; else if (!value) return HtmlCode.LENGTH_EMPTY; }}
                                getErrorType={(error) => { if (error == 1) return " cannot be empty."; else if (error == 2054) return " is already in use with annother of your ad." }} />
                        ))}

                        <AdImages ref={adImagesRef} images={ImageObject.fromStringArray(adImagesPath)} />

                        {/* <AdTags  /> */}

                        {
                            SELECTS.map((value, index) => (
                                <SelectorReader 
                                    key={`select-${index}`}
                                    idAd={ad?.idAd}
                                    value={ad[value.name]}
                                    name={value.name}
                                    options={value.options}
                                    request={value.request}
                                />
                            ))
                        }
                    </>
                )
            }
        </div>
    );
}