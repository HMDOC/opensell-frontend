import { useRef, useState } from "react";
import { checkLogin } from '../../services/LogInService';
import { NavLink, useNavigate } from "react-router-dom";
import { CustomerInfo } from "../../entities/dto/CustomerInfo";
import { setToken } from "../../services/SetToken";
import "../../css/component/page/Login.css"

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
        New here? Register <NavLink to="/signup">here</NavLink>
        <form id="form">
            <label>Email or username:</label><br />
            <input className="inputForm" type="text" ref={username} id="username"></input>&nbsp;{error.username}<br /><br />
            <label>Password:</label><br />
            <input className="inputForm" type="password" ref={password}></input>&nbsp;{error.password}<br /><br />
            <button type="submit" onClick={handleSubmit}>Log in</button>
        </form><br />
        {error.creds}
    </div>
)
}