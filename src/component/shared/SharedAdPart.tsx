import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { createRef, PureComponent, ReactNode, useEffect, useState } from "react";
import { Schema } from "yup";
import "@css/component/part/SharedAdPart.scss";
import { adModification } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";
import { HtmlCode } from "../../services/verification/HtmlCode";
import IconLabelError from "@shared/part/IconLabelError";

export const MAX_PRICE = 999990;

/**
 * To identify the field when we send the query to modify and Ad,
 * 
 * @author Achraf
 */
export enum ModifType {
    TITLE,
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
    title: string;
    name: string;
    type?: InputType;
    modifType: ModifType;
    defaultValue?: any;
    isNumber?: boolean;
    iconProp: IconProp;

    /**
     * @return 0 if value is good other number if it is a bad value.
    */
    verifyProperty?: Schema;
}

export enum BlurScopeType {
    CANCEL,
    SAVE,
    INPUT
};

export class SimpleInput extends PureComponent<SimpleInputProps> {
    public oldValue: any;

    public blurScope = { input: false, save: false, cancel: false };

    public inputRef = createRef<any>();
    public saveRef = createRef<HTMLButtonElement>();
    public cancelRef = createRef<HTMLButtonElement>();
    public divRef = createRef<HTMLDivElement>();

    public onBlur(type: BlurScopeType = BlurScopeType.INPUT) {
        // Added timer because like that it let the time to the next current element to change
        setTimeout(() => {
            if (
                !(document.activeElement == this.inputRef.current || document.activeElement == this.saveRef.current || document.activeElement == this.cancelRef.current)
            ) {
                this.cancel();
            }
        }, 50);
    }

    public state = {
        error: "",
        isEditing: false
    };

    public handleError(value: any) {
        if (this.props.verifyProperty) {

            let isError = false;
            console.log("First : " + value);
            this.props.verifyProperty
                .validate(value)
                .catch(error => {
                    this.setState({ error: error.message });
                    isError = true;
                    console.log("Yes it goes here");
                })
                .finally(() => {
                    if (!isError && this.state.error) {
                        this.setState({ error: "" });
                    }
                })
        }
    }

    public handleChange(e: any): void {
        console.log("Change");
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
                    this.setState({ isEditing: false, error: "" });
                } else this.setState({ error: ` serveur error #${res?.data}` });
            });
    }

    public save() {
        if (this.oldValue == this.inputRef.current.value) {
            this.setState({ error: " no change as been made" });
        }

        else if (!this.state.error) {
            adModification(this.props.modifType, this.inputRef.current.value, this.props.idAd)
                .then(res => {
                    if (res?.data === HtmlCode.SUCCESS) {
                        this.setState({ isEditing: false, error: "" });
                    } else if (res?.data === HtmlCode.UNIQUE_FAILED) {
                        this.setState({ isEditing: false, error: " already exists" });
                    }

                    else this.setState({ error: ` serveur error #${res?.data}` });
                });
        }
    }

    public render(): ReactNode {
        return (
            <>
                {this.props.defaultValue != undefined ? (
                    <>
                        <IconLabelError
                            iconProp={this.props.iconProp}
                            title={this.props.title}
                            error={this.state.error} />
                        <div ref={this.divRef}>
                            {this.props.type == InputType.TEXTARIA ?
                                (
                                    <textarea className="ad-modif-textarea" onBlur={() => this.onBlur()} onChange={(e) => this.handleChange(e)} onFocus={this.focusInInput.bind(this)} name={this.props.name} defaultValue={this.props.defaultValue} ref={this.inputRef} />
                                ) : (
                                    this.props.type == InputType.ONE_CHECKBOX ?
                                        (
                                            <input
                                                onClick={() => this.checkedSave()}
                                                ref={this.inputRef}
                                                type="checkbox"
                                                name={this.props.title}
                                                defaultChecked={this.props.defaultValue} />
                                        ) : (
                                            <input
                                                className="ad-modif-input"
                                                type={this.props.isNumber ? "number" : "text"}
                                                onBlur={() => this.onBlur()}
                                                defaultValue={this.props.defaultValue}
                                                ref={this.inputRef} onFocus={() => this.focusInInput()}
                                                name={this.props.title}
                                                onChange={(e) => this.handleChange(e)} />
                                        )
                                )
                            }

                            {this.state.isEditing && this.props.type != InputType.ONE_CHECKBOX ?
                                (
                                    <>
                                        <button onBlur={() => this.onBlur(BlurScopeType.CANCEL)} ref={this.cancelRef} onClick={() => this.cancel()}>x</button>
                                        <button onBlur={() => this.onBlur(BlurScopeType.SAVE)} ref={this.saveRef} onClick={() => this.save()}>v</button>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </div>

                        <br />
                    </>
                ) : (<></>)
                }
            </>
        );
    }
}

export interface SelectorReaderProps extends AdInputProps {
    title: string;
    name: string;
    iconProp: IconProp;
    options: Array<String>;
    defaultValue?: any;
    request?(value: any): any;
}

/*
Added the useEffect and the useState because the component was not working in AdModification.
*/
export function SelectorReader(props: SelectorReaderProps) {
    const [selectValue, setSelectValue] = useState();

    useEffect(() => {
        if (props.defaultValue) {
            setSelectValue(props.defaultValue);
        }
    }, [props.defaultValue]);

    const handleChange = (e: any) => {
        let value = e.target.value;
        setSelectValue(value);
        props.request?.(value);
    }

    return (
        <>
            <IconLabelError iconProp={props.iconProp} title={props.title} />
            <select name={props.name} value={selectValue} className="selector-reader" onChange={handleChange} >
                {
                    props.options.map((option, index) => (
                        <option key={createRandomKey()} value={index}>{option}</option>
                    ))
                }
            </select>

            <br />
            <br />
        </>
    );
}