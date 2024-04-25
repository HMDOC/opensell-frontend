import { ChangeEvent, useState } from "react";
import { verifyCode } from "../../services/CodeService";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/SetToken";
import { checkLogin } from "../../services/LogInService";
import "../../css/component/page/verification.css";

export default function Verification(props: {email: string, pwd: string, getCustomerInfo(): void}) {
    const [code, setCode] = useState<string>();
    const [message, setMessage] = useState<string>();
    const navigate = useNavigate();
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setCode(e.target.value);
    }
    
    function handleCode(e) {
        e.preventDefault();
        verifyCode(props.email, code).then((response: any) => {

            if (response?.data === 0) {
                console.log("Account verified");
                setMessage("Account verified");
                checkLogin(props.email, props.pwd).then(res => {
                    setToken(res?.data).then(res => {
                        props.getCustomerInfo();
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
            <img className="email-pic" alt="email-verification" src="/img/email-vef.png"></img>
            <p className="vef-top">Verify your account</p>
            <p className="vef-bottom">A code has been sent to this email: {props.email}</p>
            <input type="text" className="vefcode" onChange={handleChange}></input><br />
            <div style={{height : "100px"}}><button className="vef-button" onClick={handleCode}>Verify</button><br /><span style={{fontSize : "1vw"}}>{message}</span></div>
        </div>
    )
}