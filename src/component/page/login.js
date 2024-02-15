import { useRef, useState } from "react";
import { checkLogin } from '../../services/LogInService';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);
    const [error, setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        checkLogin(username.current.value, password.current.value).then(res => {
            console.log(res?.data);
            if (res?.data) {
                console("logged in");
            } else {
                console.log("Wrong password")
            }
        }).catch(err => console.log(err?.data));
    };

    return (
        <div>
            <h1>Login</h1>
            <form id="form">
                <label>Username:</label><br />
                <input type="text" ref={username} id="username"></input><br /><br />
                <label>Password:</label><br />
                <input type="password" ref={password}></input><br /><br />
                <button type="submit" onClick={handleSubmit}>Sign up</button>{error}
            </form>
        </div>
    )
}