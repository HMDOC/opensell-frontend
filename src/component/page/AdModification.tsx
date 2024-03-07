import { PureComponent, ReactElement, ReactNode, RefObject, createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdToModif } from "../../services/AdService";

interface InputReaderProps {
    name: string;
    type?: string;
    reference: RefObject<any>;
    multiple?: boolean;
    otherHtml?: ReactNode;
    value?: string;
    isTextArea?: boolean;
}

interface SelectorReaderProps {
    name: string;
    reference: RefObject<HTMLSelectElement>;
    options: Array<String>;
}

const SELECTS: Array<SelectorReaderProps> = [
    { name: "Visibility", reference: createRef(), options: ["test", "212", "123af"] },
    { name: "Shape", reference: createRef(), options: ["test", "212", "123af"] },
];

/**
 * When a tag is added in the frontend, we will just display it in a div.
 * 
 * - Pour les images et les tags, on pourra utiliser otherHTML
 */
const INPUTS: Array<InputReaderProps> = [
    { name: "Title", reference: createRef(), value: "old-value" },
    { name: "Reference", reference: createRef(), value: "old-value" },
    { name: "Images", type: "file", multiple: true, reference: createRef() },
    { name: "Price", type: "number", reference: createRef(), value: "19" },
    { name: "Type", reference: createRef() },
    { name: "Tags", reference: createRef(), otherHtml: <div>Hello</div> },
    { name: "Address", reference: createRef() },
    { name: "IsSold", type: "checkbox", reference: createRef() },
    { name: "Description", reference: createRef(), isTextArea: true, value: "Hamid" },
];

class SelectorReader extends PureComponent<SelectorReaderProps> {
    public asChanged: boolean = true;

    public firstChange() {
        if (!this.asChanged) this.asChanged = false;
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} : </label>
                <select onChange={this.firstChange.bind(this)} ref={this.props.reference}>
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
        console.log("Change!")
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} :</label>
                <br />
                {this.props.isTextArea ?
                    (
                        <>
                            <textarea defaultValue={this.props.value} ref={this.props.reference} />
                        </>
                    ) :
                    (
                        <input defaultValue={this.props.value} onChange={this.firstChange.bind(this)} name={this.props.name} type={this.props.type ? this.props.type : "text"} ref={this.props.reference} multiple={this.props.multiple ? this.props.multiple : false} />
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
    console.log(link);

    const [fieldList, setFieldList] = useState();

    useEffect(() => {
        getAdToModif(link).then(res => {
            // Rendu à faire mettre les anciennes valeurs dans les objets d'inputs, il faut aussi gérer les anciens tags et images.
            console.log(res?.data)
        });
    }, []);

    return (
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
                        isTextArea={value.isTextArea} />
                ))
            }

            {
                SELECTS.map((value, index) => (
                    <SelectorReader key={`select-${index}`}
                        name={value.name}
                        options={value.options}
                        reference={value.reference} />
                ))
            }

            <button onClick={console.log}>submit</button>
        </>
    );
}