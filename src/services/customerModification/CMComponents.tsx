import { ChangeEvent, Component, FormEvent, ReactNode, RefObject, createRef } from "react"
import { AdCreationInputProperties } from "../AdCreationService"
import { CustomerDto } from "../../entities/dto/CustomerDto";

export interface CMState {
    modalIsOpen: boolean;
    currentModalContent: ReactNode;
}

export interface CMProperties {
    customerData: CustomerDto;
    refreshCallback(): void;
}

export interface CMInputProperties extends AdCreationInputProperties {
    onChange?(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>): void,
    defaultValue?: string,
    cols?: number,
    rows?: number,
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>,
}

export interface CMRepeatInputProperties extends CMInputProperties {
    setRepeatInputState(isValid: boolean): void,
    addFeedbackMessage(message: string): void,
    removeFeedbackMessage(message: string): void
}

interface CMButtonProperties {
    type: "button" | "reset" | "submit", 
    buttonText: string, 
    isExitButton?: boolean,
    onClick?(event: any): void
}

export interface CMDisplayProperties {
    labelText: string;
    defaultValue?: string;
    isPassword?: boolean;
    hasButton?: boolean;
    buttonText?: string;
    buttonOnClickCallback?(): void
}

export interface CMFormProperties {
    defaultValues: CustomerDto,
    closeModalCallback(): void
}

export interface CMFormState {
    feedbackMessages: string[],
    confirmInputIsValid?: boolean
}

export class CMInput extends Component<CMInputProperties, any> {
    render(): ReactNode {
        return(
            <div className="modificationSection">
                <label className="modificationLabel" htmlFor={this.props.name}>{this.props?.labelText}</label>
                <input className="modificationInput" id={this.props.name} type={this.props.type} name={this.props.name} defaultValue={this.props?.defaultValue} 
                onChange={(changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLInputElement>)}
                ref={this.props.inputRef as RefObject<HTMLInputElement>}/>
            </div>
        )
    }
}

export class CMRepeatInput extends Component<CMRepeatInputProperties, any> {
    private INVALID_MESSAGE: string = "This value is not the same as the original input!";
    private inputRef: RefObject<HTMLInputElement> = createRef();

    public handleRepeatInputChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
        let isValid: boolean = changeEvent.target.value === this.inputRef.current.value;
        if (!isValid) this.props.addFeedbackMessage(this.INVALID_MESSAGE);
        else this.props.removeFeedbackMessage(this.INVALID_MESSAGE);
        this.props.setRepeatInputState(isValid);
    }

    render(): ReactNode {
        return(
            <>
                <CMInput labelText={this.props.labelText} name={this.props.name} type={this.props.type} inputRef={this.inputRef} onChange={(changeEvent) => this.props.onChange(changeEvent)}/>
                <CMInput labelText={"Confirm " + this.props.labelText} name={null} type={this.props.type} onChange={(changeEvent) => this.handleRepeatInputChange(changeEvent)}/>
            </>
        )
    }
}

export class CMTextArea extends CMInput {
    render(): ReactNode {
        return(
            <div className="modificationSection">
                <label className="modificationLabel" htmlFor={this.props.name}>{this.props?.labelText}</label>
                <textarea className="modificationInput modificationTextArea" id={this.props.name} name={this.props.name} defaultValue={this.props?.defaultValue} 
                onChange={(changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLTextAreaElement>)} cols={this.props.cols} rows={this.props.rows}/>
            </div>
        )
    }
}

export class CMButton extends Component<CMButtonProperties, any> {
    render(): ReactNode {
        return(
            <div className="modificationSubmit">
                <button 
                className={"modificationLabel" + (this.props.isExitButton === true ? " CMExitButton" : "")} 
                type={this.props.type} onClick={this.props.isExitButton === true ? (e) => this.props.onClick(e) : null}>
                    {this.props.buttonText}
                </button>
            </div>
        );
    }
}

export class CMDisplay extends Component<CMDisplayProperties, any> {
    constructor(properties: CMDisplayProperties) {
        super(properties)
    }

    private getDisplayedDefaultValue() {
        if (this.props.isPassword) return "***************"
        else if (this.props.defaultValue == null || this.props.defaultValue == "") return <span style={{color: 'brown'}}>{"<Empty>"}</span>
        else return this.props.defaultValue;
    }

    render(): ReactNode {
        return(
            <div className="CMDisplay-Container">
                <div className="CMDisplay-Label-Container"><label>{this.props.labelText}</label></div>
                <div className="CMDisplay-Default-Value-Container">{this.getDisplayedDefaultValue()}</div>
                <div>
                    {this.props.hasButton ? <button type="button" onClick={() => this.props.buttonOnClickCallback()}>{this.props.buttonText ? this.props.buttonText : "Change"}</button> : null}
                </div>
            </div>
        )
    }
}
