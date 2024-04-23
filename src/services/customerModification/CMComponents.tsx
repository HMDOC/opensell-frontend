import { ChangeEvent, Component, FormEvent, ReactNode, RefObject, createRef } from "react"
import { AdCreationInputProperties } from "../AdCreationService"
import { CustomerModificationView } from "../../entities/dto/CustomerModificationView"
import { CustomerDto } from "../../entities/dto/CustomerDto";
import { FormValidationObject } from "./CMFormValidation";
import { ArrayOfRequests, executeChange, getCheckResult, replaceInString } from "./CMService";
import { getFormData, getFormDataAsArray } from "../FormService";
import ModificationFeedback from "../../entities/dto/ModificationFeedback";

export interface CMState {
    defaultValues: CustomerModificationView,
    modalIsOpen: boolean;
    currentModalContent: ReactNode;
}

export interface CMProperties {
    customerData: CustomerDto
}

interface CMInputProperties extends AdCreationInputProperties {
    onChange?(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>): void,
    defaultValue?: string,
    cols?: number,
    rows?: number,
    defaultValues?: CustomerModificationView,
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>
}

interface CMRepeatInputProperties extends CMInputProperties {
    setRepeatInputState(isValid: boolean): void,
    addFeedbackMessage(message: string): void,
    removeFeedbackMessage(message: string): void
}

interface CMDisplayProperties {
    labelText: string;
    defaultValue?: string;
    isPassword?: boolean;
    hasButton?: boolean;
    buttonText?: string;
    buttonOnClickCallback?(): void
}

interface CMFormProperties {
    defaultValues: CustomerDto
}

interface CMFormState {
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

class CMRepeatInput extends Component<CMRepeatInputProperties, any> {
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

export class CMButton extends Component<{type: "button" | "reset" | "submit", buttonText: string}, any> {
    render(): ReactNode {
        return(
            <div className="modificationSubmit">
                <button className="modificationLabel" type={this.props.type}>{this.props.buttonText}</button>
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
        else if (this.props.defaultValue == null) return "This value hasn't been set yet..."
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

//
abstract class CMForm extends Component<CMFormProperties, CMFormState> {
    protected NOTHING_CHANGED = "Nothing changed...";

    constructor(properties: CMFormProperties) {
        super(properties)
        this.state = {
            feedbackMessages: []
        }
    }

    protected addFeedbackMessage(message: string):void {
        if (!this.state.feedbackMessages.includes(message)) this.setState({...this.state, feedbackMessages: [...this.state.feedbackMessages, message]});
    }

    protected removeFeedbackMessage(message: string):void {
        this.setState({...this.state, feedbackMessages: [...this.state.feedbackMessages.filter((elem) => elem !== message)]});
    }

    protected resetFeedbackMessages() {
        this.setState({feedbackMessages: []});
    }

    private removeNothingChanged(): void {
        if (this.state.feedbackMessages.includes(this.NOTHING_CHANGED)) this.removeFeedbackMessage(this.NOTHING_CHANGED);
    }

    private getCustomerIdentification(): number {
        return this.props.defaultValues.customerId;
    }

    private getDefaultValueOf(name: string): string {
        return this.props.defaultValues.customerInfo?.[name];
    }

    private isValid(name: string, value: string): boolean {
        const {inputValueIsValid} = FormValidationObject?.[name];
        return inputValueIsValid(value, this.getDefaultValueOf(name));
    }

    protected handleChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>): void {
        const {name, value} = changeEvent.target;
        const {errors} = FormValidationObject?.[name];
        if (this.isValid(name, value) !== false) this.removeFeedbackMessage(errors?.format);
        else this.addFeedbackMessage(errors?.format);
        this.removeNothingChanged();
    }

    private getRequests(formData: FormData): ArrayOfRequests {
        let tempRequests: ArrayOfRequests = [];
        for (let elem of getFormDataAsArray(formData)) {
            const {fieldName, value} = elem;
            if (this.isValid(fieldName, value) == true) tempRequests.push({mapping: FormValidationObject?.[fieldName].modificationEndPoint, data: {id: this.getCustomerIdentification(), value: value}});
        }
        return tempRequests;
    }

    private async checkForUniques(fieldName: string, value: string, hasChanged: boolean) {
        const {errors, uniqueCheck} = FormValidationObject?.[fieldName];
        if (uniqueCheck != null && hasChanged == true) {
            if ((await getCheckResult(replaceInString(uniqueCheck, value))).data > 0) { this.addFeedbackMessage(errors?.unique); return false }
            else return true;
        } else return null;
    }

    private async formIsValid(formData: FormData) {
        let nothingChanged: boolean = true;
        let currentInputIsValid: boolean
        for (let elem of getFormDataAsArray(formData)) {
            const {fieldName, value} = elem;
            currentInputIsValid = this.isValid(fieldName, value);
            if (currentInputIsValid === false) return false;
            else if (currentInputIsValid === true) nothingChanged = false;
            if (await this.checkForUniques(fieldName, value, currentInputIsValid) === false) return false;
        }
        return nothingChanged ? null : true;
    }

    private async makeChanges(array: ArrayOfRequests) {
        let feedbackObjects: ModificationFeedback[] = [];
            for (let elem = 0; elem < array.length; elem++) {
                //..........could change to let ... = await....
                await executeChange(array[elem].mapping, array[elem].data).then((rep) => {
                    feedbackObjects.push(rep?.data);
                });
            }
            return feedbackObjects;
    }

    //NEEDS TO BE CHANGED FOR REFRESH
    protected async saveChanges(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        let formData: FormData = getFormData(formEvent);
        await this.formIsValid(formData).then(async(res) => {
            if (res == true) {
                await this.makeChanges(this.getRequests(formData)).then((rep) => {
                    console.log(rep);
                })
            } else if (res == null) this.addFeedbackMessage(this.NOTHING_CHANGED);
            
        })
    }
}

export class CMBasicModificationsForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                <div>
                    {this.state.feedbackMessages.map((elem) => <p>{elem}</p>)}
                </div>
                <form onSubmit={(formEvent) => this.saveChanges(formEvent)}>
                    <CMInput name="username" defaultValue={this.props.defaultValues?.username} labelText="Username : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMInput name="firstName" defaultValue={this.props.defaultValues?.customerInfo.firstName} labelText="FirstName : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMInput name="lastName" defaultValue={this.props.defaultValues?.customerInfo.lastName} labelText="LastName : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMInput name="exposedEmail" defaultValue={this.props.defaultValues.customerInfo.exposedEmail} labelText="Public email : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMTextArea name="bio" defaultValue={this.props.defaultValues.customerInfo.bio} type="" labelText="Bio : " onChange={(changeEvent) => this.handleChange(changeEvent)} cols={80} rows={10}/>
                    <CMButton type="submit" buttonText="Save"/>
                </form>
            </div>
        )
    }
}

export class CMPersonalEmailForm extends CMForm {
    constructor(properties) {
        super(properties)
        this.state = {
            feedbackMessages: [],
            confirmInputIsValid: false
        }
    }

    render(): ReactNode {
        return(
            <div>
                <div>
                    {this.state.feedbackMessages.map((elem) => <p>{elem}</p>)}
                </div>
                <form onSubmit={(formEvent) => this.saveChanges(formEvent)}>
                    <CMRepeatInput 
                    labelText="Private Email" 
                    name="personalEmail" 
                    type="text"
                    onChange={(changeEvent) => this.handleChange(changeEvent)}
                    setRepeatInputState={(res: boolean) =>  this.setState({confirmInputIsValid: res})}
                    addFeedbackMessage={(message: string) => this.addFeedbackMessage(message)}
                    removeFeedbackMessage={(message: string) => this.removeFeedbackMessage(message)}/>
                    <CMButton type="submit" buttonText="Save"/>
                </form>
            </div>
        )
    }
}

export class CMPasswordForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                <p>PASSWORD</p>
            </div>
        )
    }
}

export class CMPhoneNumberForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                <p>PHONENUMBER</p>
            </div>
        )
    }
}

export class CMIconForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                <p>ICON</p>
            </div>
        )
    }
}
