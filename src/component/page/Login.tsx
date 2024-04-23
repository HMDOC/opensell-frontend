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
    let customerId: number;


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
        <div className="login-background">
            <div className="front-login-background">
                <h1>LOG IN</h1>
                <hr className="login-separator" />
                <form id="form">
                    <label className="login-label">Email / Username:</label><br />
                    <input placeholder="Email or username" className="inputForm" type="text" ref={username} id="username"></input>&nbsp;{error.username}<br /><br />
                    <label className="login-label">Password:</label><br />
                    <input placeholder="Password" className="inputForm" type="password" ref={password}></input>&nbsp;{error.password}<br /><br />
                    <button className="login-button" type="submit" onClick={handleSubmit}>LOG IN</button>
                </form><br />
                {error.creds}
            New here? Register <NavLink style={{textDecoration: "none", color : "var(--sr2)", fontWeight : "bold"}} to="/signup">here</NavLink>
            </div>
        </div>
    )
}