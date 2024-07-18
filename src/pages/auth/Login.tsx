import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { checkLogin } from '../../services/LogInService';
import { setToken } from "../../services/SetToken";
import "./style.css";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';

export default function Login(props) {
    const username = useRef(null);
    const password = useRef(null);
    const naviguate = useNavigate();
    const { getCustomerInfo } = useAppContext();

    const [error, setErrors] = useState(
        {
            username: "",
            password: "",
            creds: ""
        }
    );
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
                if (res?.data === "") {
                    errors.creds = "Username or password is incorrect";
                } else {
                    customerId = res?.data;
                    setToken(customerId).then(() => {
                        getCustomerInfo();
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
        <title>Login</title>
            <div className="signup-form">
                <p className="top-text">Log in</p>
                <p className="middle-text">Welcome back</p>
                <form className="form">
                    <div className="input-div">
                        <PersonIcon className="signup-icon" />
                        <input placeholder="Email or username" className="signup-input" type="text" ref={username} id="username"></input><span style={{textAlign : "right"}}>{error.username}</span>
                    </div><br />
                    <div className="input-div">
                        <KeyIcon className="signup-icon" />
                        <input placeholder="Password" className="signup-input" type="password" ref={password}></input><span style={{textAlign : "right"}}>{error.password}</span>
                    </div><br />
                    <button className="signup-button" type="submit" onClick={handleSubmit}>LOG IN</button>
                </form>
                <div className="bottom-text">
                <p> New here? Register <NavLink style={{textDecoration: "underline", fontWeight : "bold", color : "#232751"}} to="/signup">here</NavLink></p>
                <span style={{fontSize : "0.65vw"}}>{error.creds}</span>
                </div>
            </div>
            <div className="decoration-div">
                <img className="deco-pic" src="/img/auth-deco.jpg"></img>
            </div>
        </div>
    )
}