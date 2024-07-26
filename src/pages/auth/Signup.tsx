import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Verification from "./verification";
import "./style.css";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import { signup } from "@services/customer/auth";

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
    const [eErrors, setEErrors] = useState({ email: "", username: "", password: "" })

    const getError = () => {
        const errors = { email: "", username: "", password: "" };
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

    function handleChange(event: any) {
        setInfos(
            {
                ...infos,
                [event.target.name]: event.target.value
            })

        if (isFirstSubmit) {
            getError();
        }
    }

    function handleClick(event: any) {
        event.preventDefault();

        if (!isFirstSubmit) {
            setIsFirstSubmit(true)
        };

        if (getError()) {
            signup(infos.email, infos.username, infos.password).then(res => {
                if (res?.data === 1) {
                    setEErrors({ ...eErrors, email: "Email already exists" });
                } else if (res?.data === 2) {
                    setEErrors({ ...eErrors, username: "Username already exists" });
                } else if (res?.data === 3) {
                    setIsAuthentified(true);
                } else if (res?.data === 5) {
                    setEErrors({ ...eErrors, email: "Email not verified. Please check the inbox" });
                }
                else {
                    naviguate("/error");
                }
            });
        }
    }

    return (
        <div className="main-background">
            <title>Signup</title>
            {isAuthentified ? (<Verification email={infos.email} pwd={infos.password} />) : (
                <>
                    <div className="signup-form">
                        <p className="top-text">Welcome</p>
                        <p className="middle-text">Create an account</p>
                        <form className="form">
                            <div className="input-div">
                                <EmailIcon className="signup-icon" />
                                <input className="signup-input" placeholder="Email" type="email" name="email" id="email" onChange={handleChange}></input><span style={{ textAlign: "right" }}>{eErrors.email}</span>
                            </div><br />
                            <div className="input-div">
                                <PersonIcon className="signup-icon" />
                                <input placeholder="Username" className="signup-input" type="text" name="username" onChange={handleChange}></input><span style={{ textAlign: "right" }}>{eErrors.username}</span>
                            </div><br />
                            <div className="input-div">
                                <KeyIcon className="signup-icon" />
                                <input placeholder="Password" className="signup-input" type="password" name="password" onChange={handleChange}></input><span style={{ textAlign: "right" }}>{eErrors.password}</span>
                            </div><br />
                            <button className="signup-button" type="submit" onClick={handleClick}>SIGN UP</button>
                            <p className="bottom-text">Already have an account? Login <NavLink to="/login" style={{ textDecoration: "underline", fontWeight: "bold", color: "#232751" }}>here</NavLink></p>
                        </form>
                    </div>
                    <div className="decoration-div">
                        <img className="deco-pic" src="/img/auth-deco.jpg"></img>
                    </div>
                </>
            )}
        </div>
    )
}