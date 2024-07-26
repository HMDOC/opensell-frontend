import { useAppContext } from "@context/AppContext";
import { Stack } from "@mui/material";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { OtherInformationDto } from "@services/customer/setting/edit/dto/OtherInformationDto";
import { RegexCode, verify } from "@services/RegexService";
import { notEmptyWithMaxAndMin } from "@utils/yupSchema";
import { AxiosError, HttpStatusCode } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import { ReactNode, useState } from "react";
import { object, ref, string } from "yup";
import { changeEmail, changeIcon, changeOtherInformation, changePassword } from "../../../services/customer/setting/edit";
import { isEmailExists, isUsernameExists } from "../../../services/customer/setting/verification";
import { CustomerDto } from "@model/dto/CustomerDto";

const CM_FORM_ID = "setting-form";

interface CMFormProperties {
    defaultValues?: CustomerDto,
    closeModalCallback(): void
}

export function CMFormContainer(props: { children: ReactNode, initialValues: any, onSubmit(values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void, validationSchema?: any }) {
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

const USERNAME_ALREADY_EXISTS = "Username already exists";
export function CMBasicModificationsForm(props: CMFormProperties) {
    const [existingUsernames, setExistingUsernames] = useState<string[]>([]);

    return (
        <div>
            <CMFormContainer
                initialValues={{
                    username: props.defaultValues?.username ?? "",
                    firstName: props.defaultValues?.firstName ?? "",
                    lastName: props.defaultValues?.lastName ?? "",
                    bio: props.defaultValues?.bio ?? ""
                }}
                validationSchema={object({
                    username: notEmptyWithMaxAndMin(50, 3, "username").notOneOf(existingUsernames, USERNAME_ALREADY_EXISTS),
                    firstName: string().nullable().max(50, "bio cannot be more than 50 characters."),
                    lastName: string().nullable().max(50, "bio cannot be more than 50 characters."),
                    bio: string().nullable().max(5000, "bio cannot be more than 5000 characters."),
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
                        })
                }}
            >
                <Field name="username" component={AdCreationInput} label="Username" />
                <Field name="firstName" component={AdCreationInput} label="FirstName" />
                <Field name="lastName" component={AdCreationInput} label="LastName" />
                <Field name="bio" component={AdCreationInput} isTextArea label="Bio" />
            </CMFormContainer>
        </div>
    )
}

const EMAIL_ALREADY_EXISTS = "Email already exists."
export function CMEmailForm(props: { onClose(): void }) {
    const [existingEmail, setExistingEmail] = useState<string[]>([])
    const { customerDto } = useAppContext();

    return (
        <CMFormContainer
            initialValues={{
                email: "",
                confirmEmail: ""
            }}
            onSubmit={async (values, formikHelper) => {
                if ((await isEmailExists(customerDto?.customerId!, values.email)).data) {
                    setExistingEmail([...existingEmail, values.email]);
                    formikHelper.setFieldError("email", EMAIL_ALREADY_EXISTS);
                    return;
                }

                else await changeEmail(customerDto?.customerId!, values.email, values.confirmEmail);

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
        </CMFormContainer>
    )
}

const INVALID_OLD_PASSWORD = "Invalid old password.";
export function CMPasswordForm(props: CMFormProperties) {
    const [invalidOldPasswords, setInvalidOldPasswords] = useState<string[]>([]);
    return (
        <div>
            <CMFormContainer
                initialValues={{
                    oldPassword: "",
                    password: "",
                    confirmPassword: ""
                }}
                validationSchema={object({
                    oldPassword: string().required("oldPassword is required.").notOneOf(invalidOldPasswords, INVALID_OLD_PASSWORD),
                    password: string().required("password is required."),
                    confirmPassword: string().required("confirm password is required.").equals([ref("password")], "confirm password should equals password."),
                })}
                onSubmit={async (values, formikHelpers) => {
                    await changePassword(props.defaultValues?.customerId!, values as any)
                        .then(res => {
                            if (res.status == HttpStatusCode.Ok) {
                                props.closeModalCallback();
                            }
                        })
                        .catch((error: AxiosError) => {
                            if (error?.response?.status == HttpStatusCode.BadRequest) {
                                if (error?.response?.data == 102) {
                                    setInvalidOldPasswords([values.oldPassword, ...invalidOldPasswords]);
                                    formikHelpers.setFieldError("oldPassword", INVALID_OLD_PASSWORD);
                                }
                            }
                        })
                }}
            >
                <Field name="oldPassword" component={AdCreationInput} label="Old Password" type="password" />
                <Field name="password" component={AdCreationInput} label="New Password" type="password" />
                <Field name="confirmPassword" component={AdCreationInput} label="Confirm Password" type="password" />
            </CMFormContainer>
        </div>
    )
}

export function CMIconForm(props: CMFormProperties) {
    return (
        <div>
            <Formik
                initialValues={{
                    iconFile: null
                }}
                onSubmit={async (values) => {
                    if (values.iconFile) {
                        await changeIcon(values.iconFile, props.defaultValues?.customerId!)
                            .then(res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    props.closeModalCallback();
                                }
                            })
                    } else props.closeModalCallback();
                }}
            >
                {({ setFieldValue, handleBlur }) => (
                    <Form id={CM_FORM_ID}>
                        {/** Need to make a component for the images. This component should have a `multiple` properties. To handle bot single and multiple files component. */}
                        <label>Icon</label>
                        <br />
                        <input onBlur={handleBlur} onChange={(e) => setFieldValue("iconFile", e.target.files?.item(0))} name="iconFile" type="file" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}
