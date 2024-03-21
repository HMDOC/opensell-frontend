import { ChangeEvent, useState } from "react";
import { verifyCode } from "../../services/CodeService";
import { useNavigate } from "react-router-dom";

export default function Verification(props: { email: string }) {
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
        <div>
            <h1>Verify your account</h1>
            <input type="text" id="vefcode" onChange={handleChange}></input>
            <button onClick={handleCode}>Submit</button>&nbsp;{message}
            <h3>A code has been sent to this email: {props.email}</h3>
        </div>
    )
}