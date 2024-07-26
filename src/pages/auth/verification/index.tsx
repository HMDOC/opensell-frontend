import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@context/AppContext";
import { verifyCode } from "@services/customer/auth";
import { login } from "@services/customer/auth";
import { setToken } from "@services/TokenService";
import "./style.css";

export default function Verification(props: any) {
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
        verifyCode(props.email, code).then(async (response: any) => {
            if (response?.data === 0) {
                console.log("Account verified");
                setMessage("Account verified");
                await login(props.email, props.pwd).then(async res => {
                    await setToken(res?.data).then(() => {
                        getCustomerInfo();
                    });
                });

                navigate("/");
            }
            else {
                setMessage("Invalid code");
            }
        }).catch((error: any) => {
            console.log(error);
        });
    }
    return (
        <div className="verify-div">
            <title>Verification</title>
            <img className="email-pic" alt="email-verification" src="/img/email-vef.png"></img>
            <p className="vef-top">Verify your account</p>
            <p className="vef-bottom">A code has been sent to this email: {props.email}</p>
            <input type="text" className="vefcode" onChange={handleChange}></input><br />
            <div style={{ height: "100px" }}><button className="vef-button" onClick={handleCode}>Verify</button><br /><span style={{ fontSize: "1vw" }}>{message}</span></div>
        </div>
    )
}