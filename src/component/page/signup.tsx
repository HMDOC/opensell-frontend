import { useState } from "react";
import { checkSignup } from "../../services/SignupService";
import { useNavigate } from "react-router-dom";
import Verification from "./Verification";

export default function Signup() {
    const naviguate = useNavigate();
    const [isFirstSubmit, setIsFirstSubmit] = useState(false);
    const [isAuthentified, setIsAuthentified] = useState(false);

    const [infos, setInfos] = useState(
        {
            email: "",
            username: "",
            password: "",
        }
    );
    const [eErrors, setEErrors] = useState({email : "", username: "", password : ""})

    const getError = () => {
        const errors = {email : "", username: "", password : ""};
        if (!infos.email) {
            errors.email = "Required";
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(infos.email)) {
            errors.email = "Wrong email format";
        }
        if (!infos.username) {
            errors.username = "Required";
        }
        if (!infos.password) {
            errors.password = "Required";
        } else if (infos.password.length < 10) {
            errors.password = "Password must be at least 10 characters long"
        } else if (!/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(infos.password)) {
            errors.password = "Password must contain at least one special character";
        }

        setEErrors(errors);

        return !errors.email && !errors.password;
    }

    function handleChange(event) {
        setInfos(
            {
                ...infos,
                [event.target.name]: event.target.value
            })

        if (isFirstSubmit) {
            getError();
        }
    }

    function handleClick(event) {
        event.preventDefault();

        if (!isFirstSubmit) {
            setIsFirstSubmit(true)
        };

        if (getError()) {
            checkSignup(infos.email, infos.username, infos.password).then(res => {
                if (res?.data === 1) {
                    setEErrors({...eErrors, email: "Email already exists"});
                } else if (res?.data === 2) {
                    setEErrors({...eErrors, username : "Username already exists"});
                    } else if (res?.data === 3) {
                        setIsAuthentified(true);
                    } else {
                        naviguate("/error");
                    }
            });
        }
    }
    
    return (
        <div className="main-background">
            {isAuthentified ? (<Verification email={infos.email} />) : (
                <div>
                <h1>Sign up</h1>
                <form id="form">
                    <label>Email: *</label><br />
                    <input type="email" name="email" id="email" onChange={handleChange}></input>&nbsp;{eErrors.email}<br /><br />
                    <label>Username: *</label><br />
                    <input type="text" name="username" onChange={handleChange}></input>&nbsp;{eErrors.username}<br /><br />
                    <label>Password: *</label><br />
                    <input type="password" name="password" onChange={handleChange}></input>&nbsp;{eErrors.password}<br /><br />
                    <button type="submit" onClick={handleClick}>Sign up</button>
                </form>
                </div>
            )}
        </div>
    )
}