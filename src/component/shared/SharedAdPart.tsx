import { ChangeEvent, createRef, PureComponent, ReactNode } from "react";
import { adModification } from "../../services/AdService";
import { HtmlCode } from "../../services/verification/HtmlCode";
import { AxiosResponse } from "axios";
import { createRandomKey } from "../../services/RandomKeys";

export const VISIBILITY_ARRAY: string[] = ["public", "private", "link only"];
export const SHAPE_ARRAY: string[] = ["new", "like new", "good", "usable", "bad", "unknown"];
export const MAX_PRICE = 999990;

/**
 * To identify the field when we send the query to modify and Ad,
 * 
 * @author Achraf
 */
export enum ModifType {
    TITLE,
    REFERENCE,
    PRICE,
    AD_TYPE,
    ADDRESS,
    IS_SOLD,
    DESCRIPTION,
    VISIBILITY,
    SHAPE
}

/**
 * The type for the SimpleInput component.
 * 
 * @auhtor Achraf
 */
export enum InputType {
    DEFAULT,
    ONE_CHECKBOX,
    TEXTARIA
}

/**
 * This interface is here to enable polymorphisme with the props.
 * 
 */
export interface AdInputProps {

}

/**
 * The props of the SimpleInput Component.
 * 
 * @author Achraf
 */
export interface SimpleInputProps extends AdInputProps {
    idAd?: number;
    name: string;
    type?: InputType;
    modifType: ModifType;
    defaultValue?: any;
    isNumber?: boolean;

    /**
     * @return 0 if value is good other number if it is a bad value.
    */
    checkValue(value: any): number;
    getErrorType(error: number): string;
}

export class SimpleInput extends PureComponent<SimpleInputProps> {
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
        if (!this.state.isEditing) {
            this.setState({ isEditing: true });
            this.oldValue = this.inputRef.current.value;
        }
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
                                        type={this.props.isNumber ? "number" : "text"}
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

export interface SelectorReaderProps extends AdInputProps {
    idAd?: number;
    name: string;
    options: Array<String>;
    defaultValue?: string;
    request?(value: any, idAd: number): Promise<AxiosResponse<any, any>>;
}

export class SelectorReader extends PureComponent<SelectorReaderProps> {
    public handleChange(e: ChangeEvent<HTMLSelectElement>) {
        this.props.request?.(e.target.value, this.props.idAd);
    }

    public render(): ReactNode {
        return (
            <>
                <label>{this.props.name} : </label>
                <select name={this.props.name} defaultValue={this.props.defaultValue} onChange={this.props.request ? (e) => this.handleChange(e) : null} >
                    {
                        this.props.options.map((option, index) => (
                            <option key={createRandomKey()} value={`${index}`}>{option}</option>
                        ))
                    }
                </select>
                <br />
                <br />
            </>
        )
    }
}