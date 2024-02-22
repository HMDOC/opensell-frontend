import { useState } from "react";

export default function Verification(props) {
    const [code, setCode] = useState<string>("");
    function handleChange(e) {
        e.preventDefault();
        var input: any = document.getElementById("vefcode");
        setCode(input.value);
    }
    // Pour faire comme avec JS tu fais any
    function verifyCode(e: any) {
        e.preventDefault();
        console.log(code);
    }
    return (
        <div>
            <h1>Verify your account</h1>
            <input type="text" id="vefcode" onChange={handleChange}></input>
            <button onClick={verifyCode}>Submit</button>
            <h3>A code has been sent to this email: {props.email}</h3>
        </div>
    )
}