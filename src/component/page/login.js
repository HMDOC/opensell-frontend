import { useRef } from "react";
import { checkLogin } from "./proxy.ts";

export default function Login() {
    const username = useRef();
    const password = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        checkLogin(username.current.value, password.current.value).then(res => console.log(res.data));
    }
    return (
        <div>
            <h1>Login</h1>
            <form id="form">
                <label>Username:</label><br />
                <input type="text" ref={username} id="username"></input><br /><br />
                <label>Password:</label><br />
                <input type="password" ref={password}></input><br /><br />
                <button type="submit" onClick={handleSubmit}>Sign up</button>
            </form>
        </div>
    )
}