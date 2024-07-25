import { Stack } from "@mui/material";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { ChangeEvent, Component, FormEvent, ReactNode, RefObject, createRef, useState } from "react";
import ModificationFeedback from "@model/dto/ModificationFeedback";
import { getFormData, getFormDataAsArray } from "@services/FormService";
import { CMFormProperties, CMFormState, CMInput, CMRepeatInput } from "./CMComponents";
import { FormValidationObject } from "@services/customerModification/CMFormValidation";
import { ArrayOfRequests, changeCustomeremail, executeChange, getCheckResult, changeCustomerIconPath, replaceInString, changeOtherInformation } from "../../../services/customer/setting/edit";
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { object, ref, string } from "yup";
import { useAppContext } from "@context/AppContext";
import { RegexCode, verify } from "@services/RegexService";
import { notEmptyWithMaxAndMin } from "@utils/yupSchema";
import { OtherInformationDto } from "@services/customer/setting/edit/dto/OtherInformationDto";
import { isEmailExists, isUsernameExists } from "../../../services/customer/setting/verification";


export function CMFormContainer(props: { children: ReactNode, saveChanges(formEvent: any): void }) {
    return (
        <form onSubmit={props.saveChanges} id="setting-form">
            <Stack spacing={2}>
                {props.children}
            </Stack>
        </form>
    );
}

export function CMFormContainerV2(props: { children: ReactNode, initialValues: any, onSubmit(values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void, validationSchema?: any }) {
    return (
        <Formik
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
            validationSchema={props.validationSchema}
        >
            <Form id="setting-form">
                <Stack spacing={2}>
                    {props.children}
                </Stack>
            </Form>
        </Formik>
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

    private getCustomerIdentification(): number | undefined {
        return this.props.defaultValues?.customerId;
    }

    protected getDefaultValueOf(name: string): string | undefined {
        if (name === "username") return this.props.defaultValues?.username;
        return (this.props.defaultValues?.customerInfo as any)?.[name];
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

const USERNAME_ALREADY_EXISTS = "Username already exists";
export function CMBasicModificationsForm(props: CMFormProperties) {
    const [existingUsernames, setExistingUsernames] = useState<string[]>([]);

    return (
        <div>
            <CMFormContainerV2
                initialValues={{
                    username: props.defaultValues?.username ?? "",
                    firstName: props.defaultValues?.customerInfo?.firstName ?? "",
                    lastName: props.defaultValues?.customerInfo?.lastName ?? "",
                    bio: props.defaultValues?.customerInfo?.bio ?? ""
                }}
                validationSchema={object({
                    username: notEmptyWithMaxAndMin(50, 3, "username").notOneOf(existingUsernames, USERNAME_ALREADY_EXISTS),
                    firstName: notEmptyWithMaxAndMin(50, 3, "firstName"),
                    lastName: notEmptyWithMaxAndMin(50, 3, "lastName"),
                    bio: notEmptyWithMaxAndMin(5000, 10, "bio"),
                })}
                onSubmit={async (values, formikHelpers) => {
                    if ((await isUsernameExists(props.defaultValues?.customerId!, values.username)).data) {
                        setExistingUsernames([values.username, ...existingUsernames])
                        formikHelpers.setFieldError("username", USERNAME_ALREADY_EXISTS);
                        return;
                    }
                    await changeOtherInformation(props.defaultValues?.customerId!, values as OtherInformationDto)
                        .then(res => {
                            if (res.status == HttpStatusCode.Ok) {
                                props.closeModalCallback();
                            }
                        }).catch(error => {

                        });
                }}
            >
                <Field name="username" component={AdCreationInput} label="Username" />
                <Field name="firstName" component={AdCreationInput} label="FirstName" />
                <Field name="lastName" component={AdCreationInput} label="LastName" />
                <Field name="bio" component={AdCreationInput} isTextArea label="Bio" />
            </CMFormContainerV2>
        </div>
    )
}

const EMAIL_ALREADY_EXISTS = "Email already exists."
export function CMEmailForm(props: { onClose(): void }) {
    const [existingEmail, setExistingEmail] = useState<string[]>([])
    const { customerDto } = useAppContext();

    return (
        <CMFormContainerV2
            initialValues={{
                email: "",
                confirmEmail: ""
            }}
            onSubmit={async (values, formikHelper) => {
                if ((await isEmailExists(customerDto?.customerId, values.email)).data) {
                    setExistingEmail([...existingEmail, values.email]);
                    formikHelper.setFieldError("email", EMAIL_ALREADY_EXISTS);
                    return;
                }

                else await changeCustomeremail(customerDto?.customerId, values.email, values.confirmEmail);

                props.onClose();
            }}
            validationSchema={object({
                email: string()
                    .required("New email cannot be empty")
                    .test("emailValid", "invalid email format.", (value) => new Promise((resolve) => resolve(verify(value, RegexCode.EMAIL))))
                    .notOneOf(existingEmail, EMAIL_ALREADY_EXISTS),
                confirmEmail: string()
                    .required("Confirm email cannot be empty")
                    .test("emailValid", "invalid email format.", (value) => new Promise((resolve) => resolve(verify(value, RegexCode.EMAIL))))
                    .equals([ref("email")], "Confirm email must equal to new email.")
            })}
        >
            <Field
                component={AdCreationInput}
                label="New email"
                name="email"
            />

            <Field
                component={AdCreationInput}
                label="Confirm email"
                name="confirmEmail"
            />
        </CMFormContainerV2>
    )
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

export class CMIconForm extends CMForm {
    protected currentFile: File;

    private handleIconChange(changeEvent: ChangeEvent<HTMLInputElement>) {
        this.currentFile = changeEvent.currentTarget.files[0];
    }

    private async saveIconChange(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        await changeCustomerIconPath(this.currentFile, this.props.defaultValues?.customerId)
            .then(res => {
                if (res.status == 200) {
                    this.addFeedbackMessage(this.CHANGE_SUCCESSFUL);
                }

                else this.addFeedbackMessage("Something went wrong...");
            }).catch((error: AxiosError) => {
                this.addFeedbackMessage("Something went wrong...")
            });
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
