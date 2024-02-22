import { useState } from "react";
import { checkSignup } from "../../services/SignupService";

export default function Signup() {
    const [isFirstSubmit, setIsFirstSubmit] = useState(false);

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
                console.log(res.data);
                if (res?.data === 1) {
                    setEErrors({email : "Email already exists"});
                } else if (res?.data === 2) {
                    setEErrors({username : "Username already exists"});
                    } else {
                        console.log(res?.data);
                    }
            });
        }
    }
    
    return (
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
    )
}