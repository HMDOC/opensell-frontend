import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

export default function Signup() {
    const navigate = useNavigate();
    const [isCorrect, setIsCorrect] = useState(false);
    const [isFirstSubmit, setIsFirstSubmit] = useState(false);

    const [infos, setInfos] = useState(
        {
            email: "",
            password: ""
        }
    );
    const [errors, setErrors] = useState({})

    const getError = () => {
        const errors = {}
        if (!infos.email) {
            errors.email = "Required";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(infos.email)) {
            errors.email = "Wrong email format";
        }
        if (!infos.password) {
            errors.password = "Required";
        } else if (infos.password.length < 10) {
            errors.password = "Password must be at least 10 characters long"
        } else if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(infos.password)) {
            errors.password = "Password must contain at least one special character";
        }
        setErrors(errors);
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
        console.log(errors);
        if (!errors.email && !errors.password) {
            navigate("/verification");
        }
        if (isCorrect) {
            // emailjs.sendForm("service_q43eo43", "template_m9mke14",document.getElementById("form"), "JVWiU1aD5RwLlfMiN");
        }

    }
    
    return (
        <div>
            <h1>Sign up</h1>
            <form id="form">
                <label>Email: *</label><br />
                <input type="email" name="email" id="email" onChange={handleChange}></input>&nbsp;{errors.email}<br /><br />
                <label>Password: *</label><br />
                <input type="password" name="password" onChange={handleChange}></input>&nbsp;{errors.password}<br /><br />
                <button type="submit" onClick={handleClick}>Sign up</button>
            </form>
        </div>
    )
}