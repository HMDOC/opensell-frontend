import { ChangeEvent, HTMLInputTypeAttribute, PureComponent, ReactElement, ReactNode, Ref, RefObject, createRef, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { changeAd, getAdToModif } from "../../services/AdService";
import Loading from "../part/Loading";

var a: Map<String, Object> = new Map<String, Object>();

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
    request?(): void
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

interface SimpleInputProps {
    label: string;
    name: string;
    type?: HTMLInputTypeAttribute;
    value?: any;
    isTextArea?: boolean;
    isChecked?: boolean;
    request(value: any): number;
    /**
     * 
     * @return 0 if value is good other number if it is a bad value.
    */
    checkValue(value: any): number;
    getErrorType(error: number): void;
}

class SimpleInput extends PureComponent<SimpleInputProps> {
    public oldValue: any;

    public inputRef: RefObject<HTMLInputElement> = createRef();
    public saveRef: RefObject<HTMLButtonElement> = createRef();
    public cancelRef: RefObject<HTMLButtonElement> = createRef();

    public state = {
        error: 0,
        isEditing: false
    };

    public handleChange(e: ChangeEvent<HTMLInputElement>): void {
        var error = this.props.checkValue(e.target.value);
        if (error != this.state.error) this.setState({ error: error });
    }

    public focusIn() {
        this.setState({ isEditing: true });
        this.oldValue = this.inputRef.current.value;
    }

    public cancel() {
        this.setState({ isEditing: false });
        this.inputRef.current.value = this.oldValue;
    }

    public save() {
        this.setState({ isEditing : false });
        var resultCode = this.props.request(this.inputRef.current.value);
        if(resultCode != this.state.error) this.setState({error : resultCode});
    }

    public render(): ReactNode {
        return (
            <>
                {this.state.error != 0 ? this.props.getErrorType(this.state.error) : this.props.label}
                <br />
                <div>
                    <input ref={this.inputRef} onFocus={this.focusIn.bind(this)} name={this.props.name} onChange={this.handleChange.bind(this)} />
                    {this.state.isEditing ?
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
                        <SimpleInput request={value => {console.log(value); return 0;}} name="test" checkValue={(value: any) => { return 0; }} getErrorType={() => { return "" }} label="test" />
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
                                // isFile={value.isFile}
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