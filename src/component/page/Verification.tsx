import { ChangeEvent, useState } from "react";
import { verifyCode } from "../../services/CodeService";

export default function Verification(props: {email: string}) {
    const [code, setCode] = useState<string>();
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setCode(e.target.value);
    }
    
    function handleCode(e) {
        e.preventDefault();
        verifyCode(code).then((response: any) => {
            console.log(response);
        }).catch((error: any) => {
            console.log(error);
        });
    }
    return (
        <div>
            <h1>Verify your account</h1>
            <input type="text" id="vefcode" onChange={handleChange}></input>
            <button onClick={handleCode}>Submit</button>
            <h3>A code has been sent to this email: {props.email}</h3>
        </div>
    )
}