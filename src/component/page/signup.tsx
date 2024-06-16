import { useContext, useState } from "react";
import { checkSignup } from "../../services/SignupService";
import { NavLink, useNavigate } from "react-router-dom";
import Verification from "./Verification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import "../../css/component/page/signup.css";
import { ApplicationContext } from "../../ApplicationContext";


export default function Signup(props) {
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
                    setEErrors({ ...eErrors, email: "Email already exists" });
                } else if (res?.data === 2) {
                    setEErrors({ ...eErrors, username: "Username already exists" });
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
        <title>Signup</title>
            {isAuthentified ? (<Verification email={infos.email} pwd={infos.password} />) : (
                <>
                    <div className="signup-form">
                        <p className="top-text">Welcome</p>
                        <p className="middle-text">Create an account</p>
                        <form className="form">
                            <div className="input-div">
                                <FontAwesomeIcon icon={faEnvelope} className="signup-icon" />
                                <input className="signup-input" placeholder="Email" type="email" name="email" id="email" onChange={handleChange}></input><span style={{ textAlign: "right" }}>{eErrors.email}</span>
                            </div><br />
                            <div className="input-div">
                                <FontAwesomeIcon icon={faUser} className="signup-icon"></FontAwesomeIcon>
                                <input placeholder="Username" className="signup-input" type="text" name="username" onChange={handleChange}></input><span style={{ textAlign: "right" }}>{eErrors.username}</span>
                            </div><br />
                            <div className="input-div">
                                <FontAwesomeIcon icon={faKey} className="signup-icon"></FontAwesomeIcon>
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