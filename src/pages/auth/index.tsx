"use client";

import { DESKTOP_VIEW, useAppContext } from "@context/AppContext";
import { Button, Card, Container, Stack, Typography } from "@mui/material";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { login, signup } from "@services/customer/auth";
import { setToken } from "@services/TokenService";
import { AxiosError, HttpStatusCode } from "axios";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import Verification from "./verification";

const USERNAME_EXISTS = "username already exists.";
const EMAIL_EXISTS = "email already exists.";

export default function Auth(props: { isLogin?: boolean }) {
    const [invalidUsernames, setInvalidUsernames] = useState<string[]>([]);
    const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
    const [isAuthentified, setIsAuthentified] = useState(false);
    const navigate = useNavigate();
    const { getCustomerInfo } = useAppContext();

    return (
        <Container>
            <Formik
                initialValues={{
                    username: "",
                    pwd: "",
                    email: ""
                }}
                onSubmit={async (values, formikHelpers) => {
                    if (props.isLogin) {
                        await login(values.username, values.pwd)
                            .then(async res => {
                                if (res?.data) {
                                    await setToken(res?.data).then(() => {
                                        getCustomerInfo();
                                        navigate("/");
                                    });
                                }
                            }).catch((error: AxiosError) => {
                                if (error.response?.status == 400) {
                                    formikHelpers.resetForm({ errors: { username: "invalid username or password." }, touched: { username: true } });
                                }
                            });
                    }

                    else {
                        await signup(values.email, values.username, values.pwd)
                            .then(res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    setIsAuthentified(true);
                                }
                            })
                            .catch((error: AxiosError) => {
                                if (error.response?.status == 400) {
                                    let data = error.response.data as any;

                                    if (data?.code == 188) {
                                        setInvalidEmails([...invalidEmails, values.email]);
                                        formikHelpers.setFieldError("email", EMAIL_EXISTS);
                                    } else if (data?.code == 202) {
                                        setInvalidUsernames([...invalidUsernames, values.username]);
                                        formikHelpers.setFieldError("username", USERNAME_EXISTS);
                                    }
                                }
                            });
                    }
                }}
                validationSchema={object({
                    username: string()
                        .required("username is required")
                        .min(4, "username need to be at least 4 characters.")
                        .max(30, "username need to be at most 30 characters.")
                        .notOneOf(invalidUsernames, USERNAME_EXISTS)
                    ,
                    pwd: props.isLogin ?
                        string()
                            .required("password is required.")
                        :
                        string()
                            .required("password is required")
                            .min(8, "password need to be at least 8 characters.")
                            .max(100, "password need to be at most 100 characters."),
                    email: props.isLogin ? string() :
                        string().required("email is required.").email("invalid email format.").notOneOf(invalidEmails, EMAIL_EXISTS)
                })}
            >
                {({ values }) => (
                    <>
                        {isAuthentified ? (<Verification email={values.email} pwd={values.pwd} />) : (
                            <Form id={props.isLogin ? "login" : "signup"}>
                                <Card
                                    component={Stack}
                                    direction="row"
                                    flexWrap="wrap"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={3}
                                    padding={3}
                                    useFlexGap
                                >
                                    <Stack width={450} spacing={2} useFlexGap flexWrap="wrap">
                                        <Typography variant="h3">{props.isLogin ? "Login" : "Sign up"}</Typography>
                                        <Typography variant="subtitle1">{props.isLogin ? "Welcome back! Nice to see you again!" : "The marketplace redesigned!"}</Typography>
                                        {!props.isLogin ? <Field name="email" component={AdCreationInput} label="Email" type="email" /> : <></>}
                                        <Field name="username" component={AdCreationInput} label="Username" />
                                        <Field name="pwd" component={AdCreationInput} label="Password" type="password" />

                                        <Button type="submit">{props.isLogin ? "Sign in" : "Create account"}</Button>
                                        <Typography>
                                            {props.isLogin ? "Do not have an account. " : "Already have an account. "}
                                            <Link to={props.isLogin ? "/signup" : "/login"}>{props.isLogin ? "Sign up" : "Login"}</Link>
                                        </Typography>
                                    </Stack>

                                    <Stack display={DESKTOP_VIEW} minHeight="650px" justifyContent="center">
                                        <img height="500px" width="350px" src={props.isLogin ? "/img/login_background.png" : "/img/auth-deco.jpg"} />
                                    </Stack>
                                </Card>
                            </Form>
                        )}
                    </>
                )}
            </Formik>
        </Container>
    );
}