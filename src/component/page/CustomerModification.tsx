import {CustomerModificationView} from "../dto/CustomerModificationView";
import {
    getCustomerModificationView,
    formInformation as info,
    INVALID_INPUT,
    VALID_INPUT,
    formSensibleInformation as sensibleInfo,
    bio,
    getCompleteFormInfo, changeTest
} from "../../services/CustomerService";
import React, {ChangeEvent, createRef, FormEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RegexCode, verify} from "../../services/FormService";

/**
 *
 * @author Olivier Mansuy
 *
 */
export default function CustomerModification() {
    const { link} = useParams();
    const [view, setView] = useState<CustomerModificationView>();
    const [inAlternateForm, setInAlternateForm] = useState(false);

    useEffect(() => {
        getCustomerModificationView(link).then((rep) => {
            setView(rep?.data);
        })
    }, [])

    const initialState = {
        username: null,
        firstName: null,
        lastName: null,
        exposedEmail: null,
        primaryAddress: null,
        iconPath: null,
        personalEmail: null,
        phoneNumber: null,
        pwd: null,
        bio: null,
    }
    const [formValues, setFormValues] = useState(initialState);
    const completeFormInfo: {} = getCompleteFormInfo();

    const formatInputElement = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, code: RegexCode) => {
        const {name, value, classList} = inputElement.target;
        if (value === "" || value === view[name]) {
            classList.remove(VALID_INPUT, INVALID_INPUT);
        } else if (verify(value, code)) {
            classList.remove(INVALID_INPUT);
            classList.add(VALID_INPUT);
        } else {
            classList.remove(VALID_INPUT);
            classList.add(INVALID_INPUT);
        }
    }

    const handleChange = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, code?: RegexCode) => {
        const {name, value} = inputElement.target;
        setFormValues(prevState => ({...prevState, [name]: value}));
        if (code) { formatInputElement(inputElement, code); }
        //console.log(formValues[name])
    }

    const handleAlternateForm = () => {
        setInAlternateForm(!inAlternateForm);
        setFormValues(initialState);
        //something to add more security.......
    }

    const saveChanges = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { target } = event;
        // @ts-ignore
        let f = new FormData(target);
        f.forEach((value, key) => {
            if (completeFormInfo[key].code) {
                console.log(key)
            }
        })
    }

    return(
        <>
            <button onClick={handleAlternateForm}>SWITCH</button>

            {inAlternateForm ?
                    (
                        <form onSubmit={(formElement) => saveChanges(formElement)}>
                            {sensibleInfo.map((info) => (
                                <div key={info.name}>
                                    <label htmlFor={info.name}>{info.labelName}</label>
                                    <input type={info.type}
                                           name={info.name}
                                           onChange={(inputElement) => handleChange(inputElement, info.code)}/>
                                </div>
                            ))}

                            <input type="submit" value={"save changes"}/>
                        </form>
                    )
                :
                    (
                        <form onSubmit={(formElement) => saveChanges(formElement)}>

                            {info.map((info) => (
                                <div key={info.name}>
                                    <label htmlFor={info.name}>{info.labelName}</label>
                                    <input type={info.type}
                                           defaultValue={view?.[info.name]}
                                           name={info.name}
                                           onChange={(inputElement) => handleChange(inputElement, info.code)}/>
                                </div>
                            ))}

                            <div>
                                <label htmlFor={bio.name}>{bio.labelName}</label>
                                <textarea name={bio.name} cols={bio.cols} rows={bio.rows} onChange={(inputElement) => handleChange(inputElement)}></textarea>
                            </div>

                            <input type="submit" value={"save changes"}/>
                        </form>
                    )
            }
        </>
    )
}