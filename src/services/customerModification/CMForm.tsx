import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { CMButton, CMFormProperties, CMFormState, CMInput, CMRepeatInput, CMTextArea } from "./CMComponents";
import { FormValidationObject } from "./CMFormValidation";
import { ArrayOfRequests, executeChange, getCheckResult, replaceInString } from "./CMService";
import { getFormData, getFormDataAsArray } from "../FormService";
import ModificationFeedback from "../../entities/dto/ModificationFeedback";

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

    protected getDefaultValueOf(name: string): string {
        if (name == "username") return this.props.defaultValues.username;
        return this.props.defaultValues?.customerInfo?.[name];
    }

    private isValid(name: string, value: string): boolean {
        const {inputValueIsValid} = FormValidationObject?.[name];
        return inputValueIsValid(value, this.getDefaultValueOf(name));
    }

    protected getFeedbackElement(): ReactNode {
        return(
            <div className="CMFeedbackContainer">{this.state.feedbackMessages[this.state.feedbackMessages.length - 1]}</div>
        )
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
            if (await this.checkForUniques(fieldName, value, currentInputIsValid) === false && currentInputIsValid == true) return false;
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

    private setChangeFeedback(array: ModificationFeedback[]) {
        for (let elem of array) {
            if (elem.code != 200) this.addFeedbackMessage("Something went wrong...")
        }
        this.addFeedbackMessage("Change was successful...");
    }

    //NEEDS TO BE CHANGED FOR REFRESH
    protected async saveChanges(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        let formData: FormData = getFormData(formEvent);
        await this.formIsValid(formData).then(async(res) => {
            if (res == true) {
                await this.makeChanges(this.getRequests(formData)).then((rep) => {
                    this.setChangeFeedback(rep);
                })
            } else if (res == null) this.addFeedbackMessage(this.NOTHING_CHANGED);
            
        })
    }
}

export class CMBasicModificationsForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                {this.getFeedbackElement()}
                <form onSubmit={(formEvent) => this.saveChanges(formEvent)}>
                    <CMInput name="username" defaultValue={this.props.defaultValues.username} labelText="Username : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMInput name="firstName" defaultValue={this.props.defaultValues.customerInfo.firstName} labelText="FirstName : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMInput name="lastName" defaultValue={this.props.defaultValues.customerInfo.lastName} labelText="LastName : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
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
                {this.getFeedbackElement()}
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

    private async savePasswordChange(formEvent: FormEvent<HTMLFormElement>) {
        if (true) super.saveChanges(formEvent);
    }

    render(): ReactNode {
        return(
            <div>
                {this.getFeedbackElement()}
                <form onSubmit={(formEvent => this.savePasswordChange(formEvent))}>
                    <CMInput labelText="Old Password" name="oldPwd" type="password" onChange={null}/>
                    <CMRepeatInput 
                        labelText="Password" 
                        name="pwd" 
                        type="password"
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

export class CMPhoneNumberForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                {this.getFeedbackElement()}
                <form onSubmit={(formEvent) => this.saveChanges(formEvent)}>
                    <CMInput labelText="Phone Number" type="text" name="phoneNumber" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CMButton type="submit" buttonText="Save"/>
                </form>
            </div>
        )
    }
}

export class CMIconForm extends CMForm {

    render(): ReactNode {
        return(
            <div>
                {this.getFeedbackElement()}
                <p>ICON</p>
            </div>
        )
    }
}
