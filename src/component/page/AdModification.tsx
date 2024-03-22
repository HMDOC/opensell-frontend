import { ChangeEvent, HTMLInputTypeAttribute, PureComponent, ReactElement, ReactNode, Ref, RefObject, createRef, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { changeAd, getAdToModif, adModification } from "../../services/AdService";
import Loading from "../part/Loading";
import { HtmlCode } from "../../services/verification/HtmlCode";

var a: Map<String, Object> = new Map<String, Object>();

export enum ModifType {
    TITLE,
    REFERENCE,
    PRICE,
    AD_TYPE,
    ADDRESS,
    IS_SOLD,
    DESCRIPTION,
    AD_IMAGES,
    AD_TAGS,
    VISIBILITY,
    SHAPE
}

interface InputReaderProps {
    label?: string;
    name: string;
    type?: string;
    reference: RefObject<any>;
    multiple?: boolean;
    otherHtml?: ReactNode;
    value?: any;
    isTextArea?: boolean;
    isChecked?: boolean;
}

interface SelectorReaderProps {
    name: string;
    reference: RefObject<HTMLSelectElement>;
    options: Array<String>;
    value?: string;
}

const SELECTS: Array<SelectorReaderProps> = [
    { name: "visibility", reference: createRef(), options: ["public", "private", "link only"] },
    { name: "shape", reference: createRef(), options: ["new", "like new", "good", "usable", "bad", "unknow"] },
];

const INPUTS: Array<InputReaderProps> = [
    { name: "title", reference: createRef() },
    { name: "reference", reference: createRef() },
    { name: "price", type: "number", reference: createRef() },
    { name: "adType", reference: createRef() },
    { name: "address", reference: createRef() },
    { name: "isSold", reference: createRef(), isChecked: true },
    { name: "description", reference: createRef(), isTextArea: true },
];

export class SelectorReader extends PureComponent<SelectorReaderProps> {
    public state = {
        value: undefined
    };

    public firstChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({ value: e.target.value });
        a.set(this.props.name, e.target.value);
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} : </label>
                <select defaultValue={this.props.value} onChange={this.firstChange.bind(this)} ref={this.props.reference}>
                    {
                        this.props.options.map((option, index) => (
                            <option key={`${this.props.name}-options-${index}`} value={`${index}`}>{option}</option>
                        ))
                    }
                </select>
                <br />
                <br />
            </>
        )
    }
}

export class InputReader extends PureComponent<InputReaderProps> {
    public state = {
        value: undefined
    }

    public firstChange(value: any) {
        this.setState({ value: value });
        a.set(this.props.name, value);
        console.log(a);
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} :</label>
                <br />
                {this.props.isTextArea ?
                    (
                        <>
                            <textarea onChange={(e) => this.firstChange(e.target.value)} style={{ width: "700px", height: "200px" }} name={this.props.name} defaultValue={this.props.value} ref={this.props.reference} />
                        </>
                    ) :
                    (
                        this.props.isChecked ?
                            (
                                <input onChange={(e) => this.firstChange(e.target.checked)} type="checkbox" name={this.props.name} defaultChecked={this.props.value} />
                            ) : (
                                <input name={this.props.name} onChange={(e) => this.firstChange(e.target.value)} defaultValue={this.props.value} type={this.props.type ? this.props.type : "text"} ref={this.props.reference} multiple={this.props.multiple ? this.props.multiple : false} />
                            )
                    )
                }
                <br />
                {this.props.otherHtml ? this.props.otherHtml : <></>}
                <br />
            </>
        )
    }
}


// Faire un gros map avec ton les types d'inputs et il va avoir un if terner pour savoir est-ce que c'est un selector, un input ou autres
class AdTags extends PureComponent<{ reference: RefObject<HTMLInputElement>, adTags: Set<string> }> {
    public state = {
        adTags: Array.from(this.props.adTags),
        error: 0
    };

    public inputChange(e: ChangeEvent<HTMLInputElement>): void {
        if (!e.currentTarget.value) {
            if (this.state.error !== 1) this.setState({ error: 1 });
        }
        else {
            if (!this.state.adTags.includes(e.currentTarget.value)) {
                this.setState({ adTags: [...this.state.adTags, e.currentTarget.value], error: 0 });
                a.set("adTags", [...this.state.adTags, e.currentTarget.value]);
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
        console.log(a);

        return (
            <>
                <label>{this.getError(this.state.error, "adTags")}</label>
                <br />

                <input onDoubleClick={this.inputChange.bind(this)} name="adTags" ref={this.props.reference} />
                <br />
                <br />

                {this.state.adTags?.map((value, index) => (
                    <button onDoubleClick={() => { let adTagsChange = this.state.adTags.filter((tag) => tag !== value); this.setState({ adTags: adTagsChange }); a.set("adTags", adTagsChange) }} key={`${index}`}>{value}</button>
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
        a.set("adImages", true);
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
                            <img width="250px" key={`image-${index}`} src={image.object} />

                        ) : (
                            <img width="250px" key={`image-${index}`} src={this.addUrl(image.object)} />
                        )
                ))}
                <br />
                <br />

            </>
        );
    }
}

enum InputType {
    DEFAULT,
    ONE_CHECKBOX,
    TEXTARIA
}

interface SimpleInputProps {
    idAd?: number;
    name: string;
    type?: InputType;
    modifType: ModifType;
    defaultValue?: any;

    /**
     * @return 0 if value is good other number if it is a bad value.
    */
    checkValue(value: any): number;
    getErrorType(error: number): string;
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
    },
];

class SimpleInput extends PureComponent<SimpleInputProps> {
    public oldValue: any;

    public inputRef = createRef<any>();
    public saveRef = createRef<HTMLButtonElement>();
    public cancelRef = createRef<HTMLButtonElement>();

    public state = {
        error: 0,
        isEditing: false,
    };

    public handleError(value: any): number {
        var error = this.props.checkValue(value);
        if (error != this.state.error) this.setState({ error: error });
        return error;
    }

    public handleChange(e: ChangeEvent<any>): void {
        this.handleError(e.target.value);
    }

    public focusInInput() {
        this.setState({ isEditing: true });
        this.oldValue = this.inputRef.current.value;
    }

    public cancel() {
        this.setState({ isEditing: false, error: 0 });
        this.inputRef.current.value = this.oldValue;
    }

    public checkedSave() {
        adModification(this.props.modifType, this.inputRef.current.checked, this.props.idAd)
            .then(res => {
                if (res?.data === 200) {
                    this.setState({ isEditing: false, error: res?.data });
                } else this.setState({ error: res?.data });
            });
    }

    public save() {
        if (this.oldValue == this.inputRef.current.value) {
            this.setState({ error: HtmlCode.VALUE_AS_NOT_CHANGE });
        }

        else if (this.handleError(this.inputRef.current.value) == HtmlCode.SUCCESS) {
            adModification(this.props.modifType, this.inputRef.current.value, this.props.idAd)
                .then(res => {
                    if (res?.data === 200) {
                        this.setState({ isEditing: false, error: res?.data });
                    } else this.setState({ error: res?.data });
                });
        }
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} {this.state.error != 0 ? this.props.getErrorType(this.state.error) : ""}</label>
                <div>
                    {this.props.type == InputType.TEXTARIA ?
                        (
                            <textarea onChange={(e) => this.handleChange(e)} onFocus={this.focusInInput.bind(this)} style={{ width: "700px", height: "200px" }} name={this.props.name} defaultValue={this.props.defaultValue} ref={this.inputRef} />
                        ) : (
                            this.props.type == InputType.ONE_CHECKBOX ?
                                (
                                    <input
                                        onClick={() => this.checkedSave()}
                                        ref={this.inputRef}
                                        type="checkbox"
                                        name={this.props.name}
                                        defaultChecked={this.props.defaultValue} />
                                ) : (
                                    <input
                                        defaultValue={this.props.defaultValue}
                                        ref={this.inputRef} onFocus={() => this.focusInInput()}
                                        name={this.props.name}
                                        onChange={(e) => this.handleChange(e)} />
                                )
                        )
                    }

                    {this.state.isEditing && this.props.type != InputType.ONE_CHECKBOX ?
                        (
                            <>
                                <button ref={this.cancelRef} onClick={this.cancel.bind(this)}>x</button>
                                <button ref={this.saveRef} onClick={this.save.bind(this)}>v</button>
                            </>
                        ) : (
                            <>

                            </>
                        )
                    }
                </div>

                <br />
                <br />
            </>
        );
    }
}

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
            // Rendu à faire mettre les anciennes valeurs dans les objets d'inputs, il faut aussi gérer les anciens tags et images.
            if (res?.data) {
                for (let input of INPUTS) {
                    input.value = res?.data[input.name];
                }

                for (let select of SELECTS) {
                    select.value = res?.data[select.name];
                }

                setIsLoading(false);
                setAdTagsStr(res?.data?.adTags);
                setAdImagesPath(res?.data?.adImagesPath);
                setAd(res?.data);
            }

            else navigate("/not-found");
        });
    }, []);

    var adTagsRef: RefObject<HTMLInputElement> = createRef();

    function handleClick(): void {

        if (a.size !== 0) {
            if (a.get("adImages")) {
                let data = new FormData();
                let adImagesObject = adImagesRef.current.getFiles();

                if (adImagesObject != null) {
                    for (let file of adImagesObject.multipartFiles) {
                        data.append("multipartFiles", file);
                    }

                    console.log(adImagesObject.multipartFiles);

                    // To deal with backend, to put in JpaJSON
                    a.delete("adImages");

                    changeAd(a, 1, { fileSpots: adImagesObject.fileSpots, oldImages: adImagesObject.oldImages, multipartFiles: data });
                }

            } else {
                changeAd(a, 1);
            }
        }
    }

    return (
        <>
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
                                checkValue={(value: any) => { if (value) return HtmlCode.SUCCESS; else if (!value) return HtmlCode.LENGTH_EMPTY; }}
                                getErrorType={(error) => { if (error == 1) return " cannot be empty."; else if (error == 2054) return " is already in use with annother of your ad." }} />
                        ))}

                        {
                            INPUTS.map((value, index) => (
                                <InputReader
                                    key={`modification-${index}`}
                                    value={value.value}
                                    name={value.name}
                                    reference={value.reference}
                                    type={value.type}
                                    multiple={value.multiple}
                                    otherHtml={value.otherHtml}
                                    isTextArea={value.isTextArea}
                                    isChecked={value.isChecked}
                                />
                            ))
                        }

                        <AdImages ref={adImagesRef} images={ImageObject.fromStringArray(adImagesPath)} />

                        <AdTags reference={adTagsRef} adTags={adTagsStr} />

                        {
                            SELECTS.map((value, index) => (
                                <SelectorReader key={`select-${index}`}
                                    value={value.value}
                                    name={value.name}
                                    options={value.options}
                                    reference={value.reference} />
                            ))
                        }

                        <button onClick={handleClick}>submit</button>
                    </>
                )
            }
        </>
    );
}