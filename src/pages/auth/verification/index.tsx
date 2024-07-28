import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@context/AppContext";
import { verifyCode } from "@services/customer/auth";
import { login } from "@services/customer/auth";
import { setToken } from "@services/TokenService";
import DraftsIcon from '@mui/icons-material/Drafts';
import { Button, Card, Container, Stack, TextField, Typography } from "@mui/material";

export default function Verification(props: { email: string, pwd: string }) {
    const [code, setCode] = useState<string>();
    const [message, setMessage] = useState<string>();
    const navigate = useNavigate();
    const { getCustomerInfo } = useAppContext();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setCode(e.target.value);
    }

    async function handleCode(e: any) {
        e.preventDefault();
        verifyCode(props.email, code)
            .then(async (response: any) => {
                if (response?.data === 0) {
                    console.log("Account verified");
                    setMessage(undefined);

                    await login(props.email, props.pwd).then(async res => {
                        await setToken(res?.data).then(() => {
                            getCustomerInfo();
                        });
                    });

                    navigate("/");
                }
                else if(!message) setMessage("Invalid code");
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
    return (
        <Container>
            <Card minHeight="600px" component={Stack} alignItems="center" spacing={3} padding={5} justifyContent="center">
                <title>Verification</title>
                <Stack alignItems="center" spacing={1}>
                    <DraftsIcon sx={{ fontSize: "210px" }} />
                    <Typography variant="h3" className="vef-top">Verify your account</Typography>
                    <Typography className="vef-bottom">A code has been sent to this email: {props.email}</Typography>
                </Stack>

                <TextField error={!!message} helperText={message} sx={{ width: "350px" }} onChange={handleChange} placeholder="Enter the verification code" />

                <Stack alignItems="center" spacing={1}>
                    <Button sx={{ width: "150px" }} onClick={handleCode}>Verify</Button>
                </Stack>
            </Card>
        </Container>
    )
}