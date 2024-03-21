import { ChangeEvent, PureComponent, ReactElement, ReactNode, RefObject, createRef, useEffect, useState } from "react";
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
    isFile?: boolean;
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

/**
 * When a tag is added in the frontend, we will just display it in a div.
 * 
 * - Pour les images et les tags, on pourra utiliser otherHTML
 */
const INPUTS: Array<InputReaderProps> = [
    { name: "title", reference: createRef() },
    { name: "reference", reference: createRef() },
    { name: "images", multiple: true, reference: createRef(), isFile: true },
    { name: "price", type: "number", reference: createRef() },
    { name: "adType", reference: createRef() },
    { name: "address", reference: createRef() },
    { name: "isSold", reference: createRef(), isChecked: true },
    { name: "description", reference: createRef(), isTextArea: true },
];

export class SelectorReader extends PureComponent<SelectorReaderProps> {
    public state = {
        value : undefined
    };

    public firstChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({value: e.target.value});
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
        value : undefined
    }

    public firstChange(value: any) {
        this.setState({value : value});
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
                                this.props.isFile ? (
                                    <input name={this.props.name} onChange={(e) => this.firstChange(e.target.value)} type="file" />
                                ) : (
                                    <input name={this.props.name} onChange={(e) => this.firstChange(e.target.value)} defaultValue={this.props.value} type={this.props.type ? this.props.type : "text"} ref={this.props.reference} multiple={this.props.multiple ? this.props.multiple : false} />
                                )
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
class AdTags extends PureComponent<{reference : RefObject<HTMLInputElement>, adTags: Set<string>}> {
    public state = {
        adTags : Array.from(this.props.adTags),
        error : 0
    };

    public inputChange(e: ChangeEvent<HTMLInputElement>): void {
        if(!e.currentTarget.value) {
            if(this.state.error !== 1) this.setState({error : 1});
        }
        else {
            if(!this.state.adTags.includes(e.currentTarget.value)) {
                this.setState({adTags : [...this.state.adTags, e.currentTarget.value], error : 0});
                a.set("adTags", [...this.state.adTags, e.currentTarget.value]);
            } else {
                if(this.state.error !== 2) this.setState({error : 2});
            }
        }
        
        e.currentTarget.value = "";
    }

    public getError(error: number, label: string): string {
        switch(error) {
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
                    <button onDoubleClick={() => {let adTagsChange = this.state.adTags.filter((tag) => tag !== value); this.setState({adTags : adTagsChange}); a.set("adTags", adTagsChange)}} key={`${index}`}>{value}</button>
                ))}

                <br />
                <br />
            </>
        );
    }
}

export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [isloading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [adTagsStr, setAdTagsStr] = useState<Set<string>>();
    
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
            }

            else {
                navigate("/not-found");
            }
        });
    }, []);

    var adTagsRef: RefObject<HTMLInputElement> = createRef();

    return (
        <>
            {isloading ?
                (
                    <Loading />
                ) : (
                    <>
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

                        <button onClick={() => {if(a.size !== 0) changeAd(a, 1);}}>submit</button>
                    </>
                )
            }
        </>
    );
}