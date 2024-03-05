import { Component, PureComponent, ReactNode, RefObject, createRef } from "react";

interface InputReaderProps {
    name: string;
    type?: string;
    reference: RefObject<HTMLInputElement>;
    multiple?: boolean;
}

/**
 * When a tag is added in the frontend, we will just display it in a div.
 * 
 * Not Done:
 * - Description
 * - Type
 * - Tags
 * 
 */
const INPUTS: Array<InputReaderProps> = [
    {name : "Title", reference : createRef()},
    {name : "Reference", reference : createRef()},
    {name : "Images", type : "file" , multiple : true, reference : createRef()},
    {name : "Price", type : "number" , reference : createRef()},
    {name : "Type", type : "text" , reference : createRef()},
    {name : "Visibility", type : "text" , reference : createRef()},
]

export class InputReader extends PureComponent<InputReaderProps>  {
    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} :</label>
                <br />
                <input type={this.props.type ? this.props.type : "text"} ref={this.props.reference} multiple={this.props.multiple ? this.props.multiple : false} />
                <br />
                <br />
            </>
        )
    }
}

export default class AdModification extends Component {
    public render(): ReactNode {
        return (
            <>
                {
                    INPUTS.map((value) => (
                        <InputReader name={value.name} reference={value.reference} type={value.type} multiple={value.multiple} />
                    ))
                }
            </>
        );
    }
}