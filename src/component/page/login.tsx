import { useEffect, useRef, useState } from "react";
import { checkLogin } from '../../services/LogInService';
import { useNavigate } from "react-router-dom";
import { CustomerInfo } from "../../entities/dto/CustomerInfo";
import * as jose from "jose";
import { setToken } from "../../services/SetToken";

export default function Login(props) {
    const username = useRef(null);
    const password = useRef(null);
    const naviguate = useNavigate();
    const [error, setErrors] = useState(
        {
            username: "",
            password: "",
            creds: ""
        }
    );
    let customerInfo: CustomerInfo = {};
    let customerId : number;
    

const handleSubmit = (e: any) => {
    e.preventDefault();
    const errors = { username: "", password: "", creds: "" };
    if (!username.current.value) {  
        errors.username = "Required";
        setErrors(errors);
    } if (!password.current.value) {
        errors.password = "Required";
        setErrors(errors);
    } else if (username.current.value && password.current.value) {
        checkLogin(username.current.value, password.current.value).then(res => {
            if (res?.data == "") {
                errors.creds = "Username or password is incorrect";
            } else {
                customerId = res?.data;
                setToken(customerId).then(() => {
                    props.getCustomerInfo();
                });
                naviguate("/");
                console.log("Login successful");
            }
            setErrors(errors);
        });
    }
};

return (
    <div className="main-background">
        <h1>Login</h1>
        <form id="form">
            <label>Email or username:</label><br />
            <input type="text" ref={username} id="username"></input>&nbsp;{error.username}<br /><br />
            <label>Password:</label><br />
            <input type="password" ref={password}></input>&nbsp;{error.password}<br /><br />
            <button type="submit" onClick={handleSubmit}>Sign up</button>
        </form><br />
        {error.creds}
    </div>
)
}