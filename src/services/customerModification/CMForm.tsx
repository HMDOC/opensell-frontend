import { Stack } from "@mui/material";
import { AxiosResponse, formToJSON } from "axios";
import { ChangeEvent, Component, FormEvent, ReactNode, RefObject, createRef } from "react";
import ModificationFeedback from "../../entities/dto/ModificationFeedback";
import { getFormData, getFormDataAsArray } from "../FormService";
import { CMFormProperties, CMFormState, CMInput, CMRepeatInput } from "./CMComponents";
import { FormValidationObject } from "./CMFormValidation";
import { ArrayOfRequests, executeChange, getCheckResult, getProfileIconPath, replaceInString } from "./CMService";

export function CMFormContainer(props: { children: ReactNode, saveChanges(formEvent: any): void }) {
    return (
        <form onSubmit={props.saveChanges} id="setting-form">
            <Stack spacing={2}>
                {props.children}
            </Stack>
        </form>
    );
}

abstract class CMForm extends Component<CMFormProperties, CMFormState> {
    protected NOTHING_CHANGED = "Nothing changed...";
    protected CHANGE_SUCCESSFUL = "Change was successful..."

    constructor(properties: CMFormProperties) {
        super(properties)
        this.state = {
            feedbackMessages: []
        }
    }

    protected addFeedbackMessage(message: string): void {
        if (!this.state.feedbackMessages.includes(message)) this.setState({ ...this.state, feedbackMessages: [...this.state.feedbackMessages, message] });
    }

    protected removeFeedbackMessage(message: string): void {
        this.setState({ ...this.state, feedbackMessages: [...this.state.feedbackMessages.filter((elem) => elem !== message)] });
    }

    protected resetFeedbackMessages() {
        this.setState({ feedbackMessages: [] });
    }

    private getCustomerIdentification(): number {
        return this.props.defaultValues?.customerId;
    }

    protected getDefaultValueOf(name: string): string {
        if (name === "username") return this.props.defaultValues.username;
        return this.props.defaultValues?.customerInfo?.[name];
    }

    private isValid(name: string, value: string): boolean {
        const { inputValueIsValid } = FormValidationObject?.[name];
        return inputValueIsValid(value, this.getDefaultValueOf(name));
    }

    protected getFeedbackElement(): ReactNode {
        return (
            <>
                {this.state.feedbackMessages.length > 0 ? <div className="CMFeedbackContainer">{this.state.feedbackMessages[this.state.feedbackMessages.length - 1]}</div> : null}
            </>
        )
    }

    protected handleChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>): void {
        const { name, value } = changeEvent.target;
        const { errors } = FormValidationObject?.[name];
        if (this.isValid(name, value) !== false) this.removeFeedbackMessage(errors?.format);
        else this.addFeedbackMessage(errors?.format);
        //if (this.state.feedbackMessages.length > 0) this.setState({hasError: true});
        //this.removeFeedbackMessage(this.NOTHING_CHANGED);
        //this.removeFeedbackMessage(this.CHANGE_SUCCESSFUL);
    }

    private getRequests(formData: FormData): ArrayOfRequests {
        let tempRequests: ArrayOfRequests = [];
        for (let elem of getFormDataAsArray(formData)) {
            const { fieldName, value } = elem;
            if (this.isValid(fieldName, value) === true) tempRequests.push({ mapping: FormValidationObject?.[fieldName].modificationEndPoint, data: { id: this.getCustomerIdentification(), value: value } });
        }
        return tempRequests;
    }

    private async checkForUniques(fieldName: string, value: string, hasChanged: boolean) {
        const { errors, uniqueCheck } = FormValidationObject?.[fieldName];
        if (uniqueCheck !== null && hasChanged === true) {
            if ((await getCheckResult(replaceInString(uniqueCheck, value, this.props.defaultValues.customerId.toString()))).data > 0) { this.addFeedbackMessage(errors?.unique); return false }
            else return true;
        } else return null;
    }

    private async formIsValid(formData: FormData) {
        let nothingChanged: boolean = true;
        let currentInputIsValid: boolean
        for (let elem of getFormDataAsArray(formData)) {
            const { fieldName, value } = elem;
            currentInputIsValid = this.isValid(fieldName, value);
            if (currentInputIsValid === false) return false;
            else if (currentInputIsValid === true) nothingChanged = false;
            if (await this.checkForUniques(fieldName, value, currentInputIsValid) === false && currentInputIsValid === true) return false;
        }
        return nothingChanged ? null : true;
    }

    private async makeChanges(array: ArrayOfRequests) {
        let feedbackObjects: ModificationFeedback[] = [];
        for (let elem = 0; elem < array.length; elem++) {
            await executeChange(array[elem].mapping, array[elem].data).then((rep) => {
                feedbackObjects.push(rep?.data);
            });
        }
        return feedbackObjects;
    }

    private setChangeFeedback(array: ModificationFeedback[]) {
        for (let elem of array) if (elem.code !== 200) this.addFeedbackMessage("Something went wrong...")
        this.addFeedbackMessage(this.CHANGE_SUCCESSFUL);
    }

    protected async saveChanges(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        let formData: FormData = getFormData(formEvent);
        await this.formIsValid(formData).then(async (res) => {
            if (res === true) {
                await this.makeChanges(this.getRequests(formData)).then((rep) => {
                    this.setChangeFeedback(rep);
                })
            } else if (res === null) this.addFeedbackMessage(this.NOTHING_CHANGED);
        })
    }
}

export class CMBasicModificationsForm extends CMForm {

    render(): ReactNode {
        return (
            <div>
                {this.getFeedbackElement()}
                <CMFormContainer saveChanges={(formEvent) => this.saveChanges(formEvent)}>
                    <CMInput name="username" defaultValue={this.props.defaultValues.username} labelText="Username" type="text" onChange={(changeEvent) => this.handleChange(changeEvent)} />
                    <CMInput name="firstName" defaultValue={this.props.defaultValues.customerInfo.firstName} labelText="FirstName" type="text" onChange={(changeEvent) => this.handleChange(changeEvent)} />
                    <CMInput name="lastName" defaultValue={this.props.defaultValues.customerInfo.lastName} labelText="LastName" type="text" onChange={(changeEvent) => this.handleChange(changeEvent)} />
                    <CMInput name="exposedEmail" defaultValue={this.props.defaultValues.customerInfo.exposedEmail} labelText="Public email" type="text" onChange={(changeEvent) => this.handleChange(changeEvent)} />
                    <CMInput isTextArea name="bio" defaultValue={this.props.defaultValues.customerInfo.bio} labelText="Bio" type="text" onChange={(changeEvent) => this.handleChange(changeEvent)} />
                </CMFormContainer>
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
        return (
            <div>
                {this.getFeedbackElement()}
                <CMFormContainer saveChanges={(formEvent) => this.saveChanges(formEvent)}>
                    <CMRepeatInput
                        labelText="New Private Email"
                        name="personalEmail"
                        type="text"
                        onChange={(changeEvent) => this.handleChange(changeEvent)}
                        setRepeatInputState={(res: boolean) => this.setState({ confirmInputIsValid: res })}
                        addFeedbackMessage={(message: string) => this.addFeedbackMessage(message)}
                        removeFeedbackMessage={(message: string) => this.removeFeedbackMessage(message)} />
                </CMFormContainer>
            </div>
        )
    }
}

export class CMPasswordForm extends CMForm {
    private oldPwdInputRef: RefObject<HTMLInputElement> = createRef();

    private async savePasswordChanges(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        let oldPasswordCheck: AxiosResponse<number, any> = await getCheckResult(
            replaceInString(FormValidationObject["pwd"]?.uniqueCheck,
                this.oldPwdInputRef.current.value,
                this.props.defaultValues.customerId.toString()));
        if (oldPasswordCheck?.data === 1) this.saveChanges(formEvent);
        else this.addFeedbackMessage("Old password value is wrong!");
    }

    render(): ReactNode {
        return (
            <div>
                {this.getFeedbackElement()}
                <CMFormContainer saveChanges={(formEvent) => this.savePasswordChanges(formEvent)}>
                    <CMInput labelText="Old Password" name={null} type="password" inputRef={this.oldPwdInputRef} />
                    <CMRepeatInput
                        labelText="New Password"
                        name="pwd"
                        type="password"
                        onChange={(changeEvent) => this.handleChange(changeEvent)}
                        setRepeatInputState={(res: boolean) => this.setState({ confirmInputIsValid: res })}
                        addFeedbackMessage={(message: string) => this.addFeedbackMessage(message)}
                        removeFeedbackMessage={(message: string) => this.removeFeedbackMessage(message)} />
                </CMFormContainer>
            </div>
        )
    }
}

export class CMPhoneNumberForm extends CMForm {

    render(): ReactNode {
        return (
            <div>
                {this.getFeedbackElement()}
                <CMFormContainer saveChanges={(formEvent) => this.saveChanges(formEvent)}>
                    <CMInput labelText="New Phone Number" type="text" name="phoneNumber" onChange={(changeEvent) => this.handleChange(changeEvent)} />
                </CMFormContainer>
            </div>
        )
    }
}

export class CMIconForm extends CMForm {
    protected currentFile: File;

    private handleIconChange(changeEvent: ChangeEvent<HTMLInputElement>) {
        this.currentFile = changeEvent.currentTarget.files[0];
    }

    private async saveIconChange(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        let res: ModificationFeedback = (await getProfileIconPath(this.currentFile, this.props.defaultValues.customerId));
        if (res.code === 200) this.addFeedbackMessage(this.CHANGE_SUCCESSFUL);
        else this.addFeedbackMessage("Something went wrong...");
    }

    render(): ReactNode {
        return (
            <div>
                {this.getFeedbackElement()}
                <CMFormContainer saveChanges={(formEvent) => this.saveIconChange(formEvent)}>
                    <CMInput name="file" type="file" accept="image/png" labelText="Icon"
                        onChange={(changeEvent) => this.handleIconChange(changeEvent as ChangeEvent<HTMLInputElement>)} />
                </CMFormContainer>
            </div>
        )
    }
}
