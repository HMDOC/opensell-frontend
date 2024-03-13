import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { executeChanges, formInformation, initialState, executeChange } from "../../services/customerModification/CustomerModificationService";
import { formatCopyOfInput, formatInputElement } from "../../services/customerModification/FormService";
import { checkSamePwd, getCheckResult, getCustomerModificationView, getRequest} from "../../services/customerModification/modificationMapping";
import { CustomerModificationView } from "../dto/CustomerModificationView";
import Loading from "../part/Loading";

/**
 *
 * @author Olivier Mansuy
 *
 */
export default function CustomerModification() {
    const {link} = useParams();
    const [view, setView] = useState<CustomerModificationView>();
    const [inAlternateForm, setInAlternateForm] = useState(false);
    const {icon, username, firstName, lastName, exposedEmail, primaryAddress, bio, personalEmail, pwd, phoneNumber, social1, social2, social3, social4, social5} = formInformation;
    const [isLoading, setIsLoading] = useState(true);
    const [operationFeedback, setOperationFeedback] = useState(null);
    const copy_str = "Copy";

    useEffect(() => {
        getCustomerModificationView(link).then((rep) => {
            setView(rep?.data);
        })
        setIsLoading(false);
    }, [])

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
        //something to add more security.......
    }

    const handleBasicChange = (inputElement: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = inputElement.target;
        setFormValues(previousState => ({
            ...previousState,
            [name]: 
                {
                    value: value, 
                    isValid: formatInputElement(inputElement, formInformation?.[name].code, view[name], () => setFeedbackMessage(name, "This field has a wrong format")), 
                    feedbackMessage: null
                }
        }));
    }

    const handleCopyOfInputChange = (inputElement: ChangeEvent<HTMLInputElement>, actualInputName: string) => {
        const {name, value} = inputElement.target;
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
                            setFeedbackMessage(key, "This value already exists");
                            resolve(false);
                        } else { formIsValid = true; }
                    })
                } 
                else if (inputIsValid) { formIsValid = true; } 
            }
            resolve(formIsValid);
        });
    }

    const savePwdChange = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // @ts-ignore
        let formData = new FormData(event.target);
        let value = formData.get(pwd.name);
        if (value === formData.get(pwd.name + copy_str) && formValues[pwd.name].isValid) {
            await checkSamePwd(link, value.toString()).then(async(rep) => {
                if (rep?.data == 0) {
                    await executeChange(getRequest(link, pwd.name, value.toString()))
                    setOperationFeedback("Change successful.");
                } else {
                    setOperationFeedback("Same as current password.")
                }
            })
        }
    }

    const saveBasicChanges = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await basicFormIsValid().then((res) => {
            if (res) {
                let requestArray: string[] = [];
                // @ts-ignore
                let formData = new FormData(event.target);
                formData.forEach((value: string, key:string) => {
                    if (formValues?.[key]?.isValid) { requestArray.push(getRequest(link, key, value)); } 
                })       
                executeChanges(requestArray).then((res) => {
                    let s:string = "";
                    for (let elem in res) {
                        s = s + res[elem]?.value + " ; ";
                    }
                    setOperationFeedback(s);
                })
            }   
        });  
    }

    return(
        <>
            <button onClick={handleAlternateForm}>SWITCH</button>
            {isLoading ? <Loading/> : 
                (
                    (inAlternateForm ? 
                        (
                            <div>
                                <div>
                                    <form>
                                        <label htmlFor={personalEmail.name}>{personalEmail.labelName}</label>
                                        <input type={personalEmail.type} name={personalEmail.name}
                                        onChange={(inputElement) => handleBasicChange(inputElement)}/>
                                        <input type={personalEmail.type} onChange={(inputElement) => handleCopyOfInputChange(inputElement, personalEmail.name)}/>
                                        <input type="submit" value="save" />
                                    </form>
                                </div>

                                <div>
                                    <form>
                                        <label htmlFor={phoneNumber.name}>{phoneNumber.labelName}</label>
                                        <input type={phoneNumber.type} name={phoneNumber.name}
                                        onChange={(inputElement) => handleBasicChange(inputElement)}/>
                                        <input type="submit" value="save" />
                                    </form>
                                </div>

                                <div>
                                    <form onSubmit={(formElement) => savePwdChange(formElement)}>
                                        <label htmlFor={pwd.name}>{pwd.labelName}</label>
                                        <input type={pwd.type} name={pwd.name}
                                        onChange={(inputElement) => handleBasicChange(inputElement)}/>
                                        <input type={pwd.type} name={pwd.name + copy_str} onChange={(inputElement) => handleCopyOfInputChange(inputElement, pwd.name)}/>
                                        <input type="submit" value="save" />
                                    </form>
                                </div>

                                <div>
                                    {operationFeedback}
                                </div>
                            </div>
                        ) 
                    : 
                        (
                            <div>
                                <form onSubmit={(formElement) => saveBasicChanges(formElement)}>

                                    {/* still need to complete icon */}
                                    <div>
                                        <img src="" alt=""/>
                                        <label htmlFor={icon.name}></label>
                                        <input type={icon.type} name={icon.name}/>
                                        <p>{formValues.icon?.feedbackMessage}</p>
                                    </div>

                                    <div>
                                        <label htmlFor={username.name}>{username.labelName}</label>
                                        <input id={username.id} type={username.type} name={username.name} defaultValue={view?.[username.name]}
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
                                            <input type="text" name={social1.name} onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social1}/>
                                        </div>
                                        <div>
                                            <input type="text" name={social2.name} onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social2}/>
                                        </div>
                                        <div>
                                            <input type="text" name={social3.name} onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social3}/>
                                        </div>
                                        <div>
                                            <input type="text" name={social4.name} onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social4}/>
                                        </div>
                                        <div>
                                            <input type="text" name={social5.name} onChange={(inputElement) => handleBasicChange(inputElement)} defaultValue={view?.social5}/>
                                        </div>
                                    </div>

                                    <input type="submit" value={"save changes"}/>
                                </form>

                                <div>
                                    {operationFeedback}
                                </div>
                            </div>
                        )
                    )
                )
            }
        </>
    )
}