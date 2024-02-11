import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [infos, setInfos] = useState(
        {
            email: "",
            password: ""
        }
    );
    const [errors, setErrors] = useState({})

    function handleChange(event) {
        setInfos(
            {
            ...infos,
            [event.target.name]: event.target.value
            })
    }

    function handleClick(event) {
        event.preventDefault();
        const errors = {}
        if (!infos.email) {
            errors.email = "Required";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(infos.email)) {
            errors.email = "Wrong email format";
        }
        if (!infos.password) {
            errors.password = "Required";
        } else if (!infos.password.length >= 10) {
            errors.password = "Password must be at least 10 characters long"
        } else if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(infos.password)) {
            errors.password = "Password must contain at least one special character";
        }
        
        if (!errors.email && !errors.password) {
            navigate("/verification");
        }
        setErrors(errors);
    }
    
    return (
        <div>
            <h1>Sign up</h1>
            <form>
                <label>Email: *</label><br />
                <input type="email" name="email" onChange={handleChange}></input>&nbsp;{errors.email}<br /><br />
                <label>Password: *</label><br />
                <input type="password" name="password" onChange={handleChange}></input>&nbsp;{errors.password}<br /><br />
                <button type="submit" onClick={handleClick}>Sign up</button>
            </form>
        </div>
    )
}