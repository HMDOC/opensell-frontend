import {ChangeEvent, Component, FormEvent, ReactNode} from "react";
import {  
    CustomerModificationProperties, 
    CustomerModificationState, 
    getCustomerModificationView,
    formValidationObject,
    replaceInString, 
    getCheckResult,
    ArrayOfRequests,
    executeChange,
    NOTHING_CHANGED
} from "../../services/customerModification/CustomerModificationService";
import { CustomerModificationButton, CustomerModificationInput, CustomerModificationSocials, CustomerModificationTextArea } from "../../services/customerModification/CustomerModificationParts";
import { getFormData, getFormDataAsArray } from "../../services/FormService";
import ModificationFeedback from "../../entities/dto/ModificationFeedback";

/**
 *
 * @author Olivier Mansuy
 * @Note 
 * https://www.w3schools.com/typescript/typescript_casting.php
 * https://javascript.plainenglish.io/promise-based-prop-in-react-78a77440f4fc
 * https://stackoverflow.com/questions/50094331/react-app-componentdidmount-not-getting-props-from-parent
 * https://blog.logrocket.com/types-vs-interfaces-typescript/
 *
 */
export default class CustomerModification extends Component<CustomerModificationProperties, CustomerModificationState> {
    constructor(properties: CustomerModificationProperties) {
        super(properties);
        this.state = {
            feedbackMessages: [],
            defaultValues: undefined
        }
    }

    componentDidMount(): void {
        if (this.props.customerData) {
            getCustomerModificationView(this.props.customerData).then((rep) => {
                if (rep?.data) this.setState({defaultValues: rep?.data});
            })
        }
    }

    private addFeedbackMessage(message: string):void {
        if (!this.state.feedbackMessages.includes(message)) this.setState({...this.state, feedbackMessages: [...this.state.feedbackMessages, message]});
    }

    private removeFeedbackMessage(message: string):void {
        this.setState({...this.state, feedbackMessages: [...this.state.feedbackMessages.filter((elem) => elem !== message)]});
    }

    private resetFeedbackMessages() {
        this.setState({feedbackMessages: []});
    }

    private removeNothingChanged(): void {
        if (this.state.feedbackMessages.includes(NOTHING_CHANGED)) this.removeFeedbackMessage(NOTHING_CHANGED);
    }

    private isValid(name: string, value: string): boolean {
        const {inputValueIsValid} = formValidationObject?.[name];
        return inputValueIsValid(value, this.getDefaultValueOf(name));
    }

    private getCustomerIdentification(): number {
        return this.props.customerData;
    }

    private getDefaultValueOf(name: string): string {
        return this.state.defaultValues?.[name];
    }

    private handleChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>): void {
        const {name, value} = changeEvent.target;
        const {errors} = formValidationObject?.[name];
        if (this.isValid(name, value) !== false) this.removeFeedbackMessage(errors?.format);
        else this.addFeedbackMessage(errors?.format);
        this.removeNothingChanged();
    }

    private async checkForUniques(fieldName: string, value: string, hasChanged: boolean) {
        return new Promise<boolean>(async(resolve) => {
            const {errors, uniqueCheck} = formValidationObject?.[fieldName];
            if (uniqueCheck != null && hasChanged == true) {
                await getCheckResult(replaceInString(uniqueCheck, value)).then((res) => {
                    if (res?.data > 0) { this.addFeedbackMessage(errors?.unique); resolve(false); }
                    else resolve(true);
                }).catch((err) => console.log(err))
            } else resolve(null);
        })
    }

    private formIsValid(formData: FormData): Promise<boolean> {
        return new Promise<boolean>(async(resolve) => {
            let nothingChanged: boolean = true;
            for (let elem of getFormDataAsArray(formData)) {
                const {fieldName, value} = elem;
                let currentInputIsValid: boolean = this.isValid(fieldName, value);
                if (currentInputIsValid == false) resolve(false);
                else if (currentInputIsValid) nothingChanged = false;
                await this.checkForUniques(fieldName, value, currentInputIsValid).then((rep) => { if (rep == false) resolve(false) })
            }
            resolve(nothingChanged ? null : true);
        });
    }

    private getRequests(formData: FormData): ArrayOfRequests {
        let tempRequests: ArrayOfRequests = [];
        for (let elem of getFormDataAsArray(formData)) {
            const {fieldName, value} = elem;
            if (this.isValid(fieldName, value) == true) {
                tempRequests.push({mapping: formValidationObject?.[fieldName].modificationEndPoint, data: {id: this.getCustomerIdentification(), value: value}});
            }
        }
        return tempRequests;
    }

    private async makeChanges(array: ArrayOfRequests): Promise<ModificationFeedback[]> {
        return new Promise<ModificationFeedback[]>(async(resolve) => {
            let feedbackObjects: ModificationFeedback[] = [];
            for (let elem = 0; elem < array.length; elem++) {
                await executeChange(array[elem].mapping, array[elem].data).then((rep) => {
                    feedbackObjects.push(rep?.data);
                });
            }
            resolve(feedbackObjects);
        });
    }

    private async saveChanges(formEvent: FormEvent<HTMLFormElement>) {
        let formData: FormData = getFormData(formEvent);
        await this.formIsValid(getFormData(formEvent)).then(async(res) => {
            if (res == true) {
                await this.makeChanges(this.getRequests(formData)).then((rep) => {
                    this.resetFeedbackMessages();
                })
            } else if (res == null) {
                formEvent.preventDefault();
                this.addFeedbackMessage(NOTHING_CHANGED);
            } else formEvent.preventDefault();
        })
    }

    render(): ReactNode {
        return (
            <div id="customer-modification-form" className="main-background">
                
                <form onSubmit={(formEvent: FormEvent<HTMLFormElement>) => this.saveChanges(formEvent)}>
                    <CustomerModificationInput name="username" defaultValue={this.state.defaultValues?.username} labelText="Username : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CustomerModificationInput name="firstName" defaultValue={this.state.defaultValues?.firstName} labelText="FirstName : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CustomerModificationInput name="lastName" defaultValue={this.state.defaultValues?.lastName} labelText="LastName : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CustomerModificationInput name="primaryAddress" defaultValue={this.state.defaultValues?.primaryAddress} labelText="Primary Address : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CustomerModificationInput name="exposedEmail" defaultValue={this.state.defaultValues?.exposedEmail} labelText="Public email : " type="text" onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <CustomerModificationTextArea name="bio" defaultValue={this.state.defaultValues?.bio} type="" labelText="Bio : " onChange={(changeEvent) => this.handleChange(changeEvent)} cols={80} rows={10}/>
                    <CustomerModificationSocials onChange={(changeEvent) => this.handleChange(changeEvent)} cols={80} rows={10} labelText="SOCIALS : " name="link" type="text" numberOfLinks={5} defaultValues={this.state.defaultValues}/>
                    <CustomerModificationButton type="submit" buttonText="Save changes"/>
                </form>

                <div>
                    {this.state.feedbackMessages.map((message: string, key: number) => ( <p key={key}>{message}</p>) )}
                </div>
            </div>
        )
    }

}