import { PureComponent, ReactElement, ReactNode, RefObject, createRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdToModif } from "../../services/AdService";
import Loading from "../part/Loading";

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
    { name: "type", reference: createRef() },
    { name: "tags", reference: createRef(), otherHtml: <div>Hello</div> },
    { name: "address", reference: createRef() },
    { name: "isSold", reference: createRef(), isChecked: true },
    { name: "description", reference: createRef(), isTextArea: true },
];

export class SelectorReader extends PureComponent<SelectorReaderProps> {
    public asChanged: boolean = true;

    public firstChange() {
        if (!this.asChanged) this.asChanged = false;
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} : </label>
                <select value={this.props.value} onChange={this.firstChange.bind(this)} ref={this.props.reference}>
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
    public asChanged: boolean = true;

    public firstChange() {
        if (!this.asChanged) this.asChanged = false;
        console.log("Change!");
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} :</label>
                <br />
                {this.props.isTextArea ?
                    (
                        <>
                            <textarea style={{ width: "700px", height: "200px" }} name={this.props.name} defaultValue={this.props.value} ref={this.props.reference} />
                        </>
                    ) :
                    (
                        this.props.isChecked ?
                            (
                                <input type="checkbox" name={this.props.name} defaultChecked={this.props.value} />
                            ) : (
                                this.props.isFile ? (
                                    <input name={this.props.name} onChange={this.firstChange.bind(this)} type="file" />
                                ) : (
                                    <input name={this.props.name} defaultValue={this.props.value} onChange={this.firstChange.bind(this)} type={this.props.type ? this.props.type : "text"} ref={this.props.reference} multiple={this.props.multiple ? this.props.multiple : false} />
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

export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [isloading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

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
            }

            else {
                navigate("/not-found");
            }
        });
    }, []);

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
                                    isChecked={value.isChecked} />
                            ))
                        }

                        {
                            SELECTS.map((value, index) => (
                                <SelectorReader key={`select-${index}`}
                                    value={value.value}
                                    name={value.name}
                                    options={value.options}
                                    reference={value.reference} />
                            ))
                        }

                        <button onClick={console.log}>submit</button>
                    </>
                )
            }
        </>
    );
}