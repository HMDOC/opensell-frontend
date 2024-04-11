import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { executeChanges, formInformation, initialState, executeChange} from "../../services/customerModification/CustomerModificationService";
import { formatCopyOfInput, formatInputElement, getFormData } from "../../services/customerModification/FormService";
import { checkSamePwd, getCheckResult, getCustomerModificationView, getRequest } from "../../services/customerModification/modificationMapping";
import { CustomerModificationView } from "../../entities/dto/CustomerModificationView";
import { Messages as feedback} from '../../services/customerModification/FeedbackMessages';
import Loading from "../part/Loading";

/**
 *
 * @author Olivier Mansuy
 *
 */
export default function CustomerModification(props: {link: string}) {
    const [view, setView] = useState<CustomerModificationView>(null);
    const [inAlternateForm, setInAlternateForm] = useState(false);
    const {icon, username, firstName, lastName, exposedEmail, primaryAddress, bio, personalEmail, pwd, phoneNumber, social1, social2, social3, social4, social5} = formInformation;
    const [isLoading, setIsLoading] = useState(true);
    const [operationFeedback, setOperationFeedback] = useState(null);
    const copy_str = "Copy";
    const save_str = "save";
    const [iconImage, setIconImage] = useState(null);
   
    useEffect(() => {
        if(props.link) {
            getCustomerModificationView(props.link).then((rep) => {
                setView(rep?.data);
            })
        }
        setIsLoading(false);
    }, [props.link])

    const [formValues, setFormValues] = useState(initialState);

    const setFeedbackMessage = (name:string, message:string) => {
        setFormValues(prev => ({
            ...prev,
            [name]: {...prev?.[name], feedbackMessage: message}
        }))
    }

    const handleAlternateForm = () => {
        setInAlternateForm(!inAlternateForm);
        setFormValues(initialState);
        setOperationFeedback(null);
        setIconImage(null);
        //something to add more security.......
    }

    const handleBasicChange = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = inputElement.target;
        setFormValues(previousState => ({
            ...previousState,
            [name]: 
                {
                    value: value, 
                    isValid: formatInputElement(inputElement, formInformation?.[name].code, view[name], () => setFeedbackMessage(name, feedback.WRONG_FORMAT)), 
                    feedbackMessage: null
                }
        }));
    }

    //accept="image/*"
    const handleIconChange = (inputElement: ChangeEvent<HTMLInputElement>) => {
        const {files, value} = inputElement.target;
        
        if (files[0]) {
            setIconImage(URL.createObjectURL(files[0]))
            setFormValues({
            ...formValues,
            icon: {isValid: true, value: value, feedbackMessage: null}
        })
        }
    
    }

    const handleCopyOfInputChange = (inputElement: ChangeEvent<HTMLInputElement>, actualInputName: string) => {
        formatCopyOfInput(inputElement, formValues[actualInputName].value);
    }

    const basicFormIsValid = ():Promise<boolean> => {
        return new Promise<boolean>(async(resolve) => {
            let inputIsValid: boolean, formIsValid: boolean = false;
            for (let key in formValues) {
                inputIsValid = formValues?.[key].isValid;
                if (inputIsValid == false) {
                    resolve(false);
                } else if (formInformation?.[key]?.isUnique && inputIsValid) {
                    await getCheckResult(getRequest(null, key, formValues?.[key].value)).then((rep) => {
                        if (rep?.data == 1) {
                            setFeedbackMessage(key, feedback.IS_NOT_UNIQUE);
                            resolve(false);
                        } else { formIsValid = true; }
                    })
                } 
                else if (inputIsValid) { formIsValid = true; } 
            }
            resolve(formIsValid);
        });
    }

    const copyOfInputIsValid = (form: FormData, originalInputName: string):boolean => {
        return form.get(originalInputName) === form.get(originalInputName + copy_str);
    }

    const savePwdChange = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {name} = pwd;
        let formData = getFormData(event);
        let value = formData.get(name).toString();
        if (copyOfInputIsValid(formData, name) && formValues[name].isValid) {
            await checkSamePwd(props.link, value.toString()).then(async(rep) => {
                if (rep?.data == 0) {
                    await executeChange(getRequest(props.link, name, value)).then((rep) => {
                        console.log(rep);
                        setOperationFeedback(feedback.CHANGE_SUCCESFUL);
                    });
                } else {
                    setOperationFeedback(feedback.SAME_PWD)
                }
            })
        } else {
            //feedback...
        }
    }

    const savePhoneNumberChange = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {name} = phoneNumber;
        const {isValid, value} = formValues[name];
        if (isValid) {
            await getCheckResult(getRequest(null, name, value)).then(async(rep) => {
                if (rep?.data == 0) {
                    await executeChange(getRequest(props.link, name, value)).then((response) => {
                        setOperationFeedback(response?.data.value);
                    })
                } else {
                    setOperationFeedback(feedback.PHONE_NUMBER_ALREADY_EXISTS);
                }
            })
        } else {
            //feedback...
        }
    }

    //needs email validation....
    const saveEmailChange = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let formData = getFormData(event);
        const {name} = personalEmail;
        const {isValid, value} = formValues[name]
        if (copyOfInputIsValid(formData, name) && isValid) {
            await getCheckResult(getRequest(null, name, value)).then(async(rep) => {
                if (rep?.data == 0) {
                    await executeChange(getRequest(props.link, name, value)).then((response) => {
                        setOperationFeedback(response?.data.value);
                    })
                } else {
                    setOperationFeedback(feedback.ADDRESS_ALREADY_EXISTS);
                }
            })
        } else {
            //...
        }
    }

    const saveIconChange = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {isValid, value} = formValues[icon.name];
        //change to regex
        if (isValid) {
            await executeChange(getRequest(props.link, icon.name, value.split("\\").join("/"))).then((rep) => {
                console.log(rep);
            })
        }
    }

    const saveBasicChanges = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await basicFormIsValid().then((res) => {
            if (res) {
                let requestArray: string[] = [];

                getFormData(event).forEach((value: string, key:string) => {
                    if (formValues?.[key]?.isValid) { requestArray.push(getRequest(props.link, key, value)); } 
                })       

                //needs better feedback...
                executeChanges(requestArray).then((res) => {
                    let s:string = "";
                    for (let elem in res) {
                        s = s + res[elem]?.value + " ; ";
                    }
                    setOperationFeedback(s);
                })
            } else {
                //feedback...
            }  
        });  
    }

    return(
        <div className="main-background">
            {isLoading ? <Loading/> : 
                (
                    (inAlternateForm ? 
                        (               
                            <div className="">
                                <div className="">
                                    <button onClick={handleAlternateForm}>SWITCH</button>                            
                                </div>

                                <div>
                                    <form onSubmit={(formElement) => saveEmailChange(formElement)}>                                      
                                        <label htmlFor={personalEmail.name}>{personalEmail.labelName}</label>                                                                             
                                        <input type={personalEmail.type} name={personalEmail.name}
                                        onChange={(inputElement) => handleBasicChange(inputElement)}/>
                                        <input type={personalEmail.type} name={personalEmail.name + copy_str} onChange={(inputElement) => handleCopyOfInputChange(inputElement, personalEmail.name)}/>
                                        <div>
                                            <button type="submit" className="">{save_str}</button>
                                        </div>
                                    </form>
                                    <p>{formValues.personalEmail?.feedbackMessage}</p>
                                </div>

                                <div>
                                    <form onSubmit={(formElement) => savePhoneNumberChange(formElement)}>
                                        <label htmlFor={phoneNumber.name}>{phoneNumber.labelName}</label>
                                        <input type={phoneNumber.type} name={phoneNumber.name}
                                        onChange={(inputElement) => handleBasicChange(inputElement)}/>

                                        <div>
                                            <button type="submit" className="">{save_str}</button>
                                        </div>
                                    </form>
                                    <p>{formValues.phoneNumber?.feedbackMessage}</p>
                                </div>

                                <div>
                                    <form onSubmit={(formElement) => savePwdChange(formElement)}>
                                        <label htmlFor={pwd.name}>{pwd.labelName}</label>
                                        <input type={pwd.type} name={pwd.name}
                                        onChange={(inputElement) => handleBasicChange(inputElement)}/>
                                        <input type={pwd.type} name={pwd.name + copy_str} onChange={(inputElement) => handleCopyOfInputChange(inputElement, pwd.name)}/>
                                        
                                        <div>
                                            <button type="submit" className="">{save_str}</button>
                                        </div>
                                    </form>
                                    <p>{formValues.pwd?.feedbackMessage}</p>
                                </div>

                                <div>
                                    {operationFeedback}
                                </div>
                            </div>
                        ) 
                    : 
                        (
                            <div className="">
                                <div className="">
                                    <button onClick={handleAlternateForm}>SWITCH</button>
                                </div>
                                
                                <div className="">
                                    <form onSubmit={(formElement) => saveIconChange(formElement)}>
                                        <div className="">
                                            <img src={iconImage} alt=""/>
                                            <div className="">
                                                <input type={icon.type} name={icon.name} onChange={(inputElement) => handleIconChange(inputElement)} accept="image/*"/>
                                            </div>
                                        </div>

                                        <div>
                                            <button type="submit" className="">{save_str}</button>
                                        </div>
                                       
                                    </form>
                                    <div>
                                        <p>{formValues.icon?.feedbackMessage}</p>
                                    </div>
                                </div>

                                <div className="">
                                    <form onSubmit={(formElement) => saveBasicChanges(formElement)}>

                                        <div>
                                            <label htmlFor={username.name}>{username.labelName}</label>
                                            <input type={username.type} name={username.name} defaultValue={view?.[username.name]}
                                            onChange={(inputElement) => handleBasicChange(inputElement)}
                                            />
                                            <p>{formValues.username?.feedbackMessage}</p>
                                        </div>

                                        <div>
                                            <label htmlFor={firstName.name}>{firstName.labelName}</label>
                                            <input type={firstName.type} name={firstName.name} defaultValue={view?.[firstName.name]}
                                            onChange={(inputElement) => handleBasicChange(inputElement)}
                                            />
                                            <p>{formValues.firstName?.feedbackMessage}</p>
                                        </div>

                                        <div>
                                            <label htmlFor={lastName.name}>{lastName.labelName}</label>
                                            <input type={lastName.type} name={lastName.name} defaultValue={view?.[lastName.name]}
                                            onChange={(inputElement) => handleBasicChange(inputElement)}
                                            />
                                            <p>{formValues.lastName?.feedbackMessage}</p>
                                        </div>

                                        <div>
                                            <label htmlFor={exposedEmail.name}>{exposedEmail.labelName}</label>
                                            <input type={exposedEmail.type} name={exposedEmail.name} defaultValue={view?.[exposedEmail.name]}
                                            onChange={(inputElement) => handleBasicChange(inputElement)}
                                            />
                                            <p>{formValues.exposedEmail?.feedbackMessage}</p>
                                        </div>

                                        <div>
                                            <label htmlFor={primaryAddress.name}>{primaryAddress.labelName}</label>
                                            <input type={primaryAddress.type} name={primaryAddress.name} defaultValue={view?.[primaryAddress.name]}
                                            onChange={(inputElement) => handleBasicChange(inputElement)}
                                            />
                                            <p>{formValues.primaryAddress?.feedbackMessage}</p>
                                        </div>

                                        <div>
                                            <label htmlFor={bio.name}>{bio.labelName}</label>
                                            <textarea name={bio.name} cols={bio.cols} rows={bio.rows} defaultValue={view?.bio}
                                            onChange={(inputElement) => handleBasicChange(inputElement)}></textarea>
                                            <p>{formValues.bio?.feedbackMessage}</p>
                                        </div>

                                        <div>
                                            <div>
                                                <input type="text" name={social1.name} 
                                                onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social1}/>
                                            </div>
                                            <div>
                                                <input type="text" name={social2.name} 
                                                onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social2}/>
                                            </div>
                                            <div>
                                                <input type="text" name={social3.name} 
                                                onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social3}/>
                                            </div>
                                            <div>
                                                <input type="text" name={social4.name} 
                                                onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social4}/>
                                            </div>
                                            <div>
                                                <input type="text" name={social5.name} 
                                                onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social5}/>
                                            </div>
                                        </div>

                                        <div>
                                            <button type="submit" className="">{save_str}</button>
                                        </div>
                                    </form>
                                </div>

                                <div className="">
                                    {operationFeedback}
                                </div>
                            </div>
                        )
                    )
                )
            }
        </div>
    )
}