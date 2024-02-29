import {CustomerModificationView} from "../dto/CustomerModificationView";
import {getCustomerModificationView} from "../../services/CustomerService";
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
        username: false,
        firstName: false,
        lastName: false,
        exposedEmail: false,
        personalEmail: false,
        primaryAddress: false,
        phoneNumber: false,
        pwd: false
    }

    //each of these attributes need to be verified with rational expressions
    //this useState syntax allows us to use only one handleChange for everything by using the name attribute (ex: isValid[nameOfInput])
    const [isValid, setIsValid] = useState(initialState); //bio, iconPath, socials


    useEffect(() => {
        console.log("reload");
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

    const handleChange = (inputElement: ChangeEvent<HTMLInputElement>, prevState: any) => {
        try {
            const {name, value} = inputElement.target;
            //let copyOfIsValid = {...isValid};
            //copyOfIsValid[target?.name] = verify(target?.name, code);
            //setIsValid(copyOfIsValid);
            setIsValid({
                ...prevState,
                username: true
            })
        } catch (ex) {
            console.log(ex);
        }
    }

    const FormInput = (param: {type: string, labelName: string, name: string, defaultValue: string, code: RegexCode}) => {
        const {type, labelName, name, defaultValue, code} = param;
        return(
            <div>
                <label htmlFor={name}>{labelName}</label>
                <input type={type} name={name} defaultValue={defaultValue} onChange={(e) => handleChange(e, {...isValid})}/>
            </div>
        )
    }

    return(
        <>
            <form>
                <FormInput type={"text"} labelName={"username"} name={"username"} defaultValue={view?.username} code={RegexCode.USERNAME}/>
                <button>SAVE</button>
            </form>
        </>
    )
}