import {CustomerModificationView} from "../dto/CustomerModificationView";
import {getCustomerModificationView, formInformation as info} from "../../services/CustomerService";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RegexCode, verify} from "../../services/FormService";

/**
 *
 * @author Olivier Mansuy
 * @description not finished
 */
export default function CustomerModification() {
    const { link} = useParams();
    // useState in order to be used in the render method
    const [view, setView] = useState<CustomerModificationView>();
    const initialState = {
        username: view?.username,
        firstName: view?.firstName,
        lastName: view?.lastName,
        exposedEmail: view?.exposedEmail,
        personalEmail: "",
        primaryAddress: view?.primaryAddress,
        phoneNumber: "",
        pwd: ""
    }
    //each of these attributes need to be verified with rational expressions
    //this useState syntax allows us to use only one handleChange for everything by using the name attribute (ex: isValid[nameOfInput])
    const [inputValues, setInputValues] = useState(initialState); //bio, iconPath, socials

    //lifecycle management hook
    useEffect(() => {
        //returns a AxiosPromise
        //.data returns the actual object
        try {
            getCustomerModificationView(link).then((rep) => {
                //if the object exists (optional chaining operator) https://medium.com/totally-typescript/what-does-the-question-mark-dot-mean-in-javascript-or-typescript-9d7d744f6077
                setView(rep?.data);
            })
        } catch (ex) {
            console.log(ex)
        }
        //array of dependencies (an array of useStates)
    }, [])

    const formatInputElement = (inputElement: ChangeEvent<HTMLInputElement>, code?: RegexCode) => {
        const {name, value} = inputElement.target;
        if (value === "" || value === view[name]) {
            inputElement.target.className = "";
        } else if (verify(value, code)) {
            inputElement.target.className = "validInput";
        } else {
            inputElement.target.className = "invalidInput";
        }
    }

    const handleChange = (inputElement: ChangeEvent<HTMLInputElement>, code?: RegexCode) => {
        try {
            const {name, value} = inputElement.target;
            let copyOfInputValue = {...inputValues};
            copyOfInputValue[name] = value;
            //will change the value at some point (we can't see the change in the handleChange)
            setInputValues(copyOfInputValue);
            formatInputElement(inputElement, code);
        } catch (ex) {
            console.log(ex);
        }
    }

    const saveChanges = () => {
        alert("slt")
    }

    return(
        <>
            <form>

                {info.map((info) => (
                    <div key={info.name}>
                        <label htmlFor={info.name}>{info.labelName}</label>
                        <input type={info.type}
                               defaultValue={view?.[info.name]} //???
                               name={info.name}
                               onChange={(inputElement) => handleChange(inputElement, info.code)}/>
                    </div>
                ))}

                <button>SAVE</button>
            </form>
        </>
    )
}