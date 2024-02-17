import { useRef, useState } from "react";
import { checkLogin } from '../../services/LogInService';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);
    const [error, setErrors] = useState(
        {
            username: "",
            password: "",
            creds: ""
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {username: "", password: ""};
        if (!username.current.value) {
            errors.username = "Required";
            setErrors(errors);
        } if (!password.current.value) {
            errors.password = "Required";
            setErrors(errors);
        } else if (username.current.value && password.current.value) {
            checkLogin(username.current.value, password.current.value).then(res => {
                if (res?.data === 1) {
                    console.log("Login successful");
                } else if (res?.data === 2) {
                    errors.creds = "Wrong password";
                } else {
                    errors.creds = "Username not found";
                }
                setErrors(errors);
            });
        }
    };

    return (
        <div>
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