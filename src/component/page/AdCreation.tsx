import { faItalic, faLocationDot, faReceipt, faScroll, faX } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import "../../css/component/page/AdModif.scss";
import "../../css/component/page/CustomerModification.css";
import { AdCreationInputProperties, AdCreationState, AdCreationpProperties, createAd, formValidation, formatCreationData } from "../../services/AdCreationService";
import { getAllAdTypes, saveAdImages } from "../../services/AdService";
import { getFormData, getFormDataAsArray } from "../../services/FormService";
import { HtmlCode } from "../../services/verification/HtmlCode";
import { AdImages } from "../shared/AdImages";
import AdShapeSelect from "../shared/AdShapeSelect";
import { AdTags } from "../shared/AdTags";
import AdTypeSelect from "../shared/AdTypeSelect";
import AdVisibilitySelect from "../shared/AdVisibilitySelect";
import { MAX_PRICE } from "../shared/SharedAdPart";
import IconLabelError from "../part/IconLabelError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @author Olivier Mansuy
 */
class AdCreationInput extends Component<AdCreationInputProperties, any> {
    constructor(properties: AdCreationInputProperties) {
        super(properties)
    }
    render(): ReactNode {
        return (
            <div className="">
                <IconLabelError iconProp={this.props.iconProp} title={this.props.labelText} />
                <input
                    className="ad-modif-input"
                    type={this.props.type}
                    min={this.props.min}
                    max={this.props.max}
                    name={this.props.name}
                    id={this.props.name}
                    step={this.props.step}
                    accept={this.props.accept}
                    required={this.props.required}
                    onChange={(changeEvent) => this.props.onChange(changeEvent)}
                />
            </div>
        )
    }
}

export default class AdCreation extends Component<AdCreationpProperties, AdCreationState> {
    constructor(properties: AdCreationpProperties) {
        super(properties)
        this.state = {
            globalErrorMessage: "",
            typeArray: [],
            errorAdTags: HtmlCode.SUCCESS,
            selectedTags: [],
            images: [],
            errorImages: "",
            adWasCreated: false
        }
    }

    setGlobalErrorMessage(error?: string) {
        this.setState({ ...this.state, globalErrorMessage: error ? error : "" });
    }

    componentDidMount(): void {
        getAllAdTypes().then((rep) => {
            this.setState({
                ...this.state,
                typeArray: rep?.data
            })
        })
    }

    private handleChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
        const {value, name} = changeEvent.currentTarget;
        if (formValidation[name]) {
            console.log(value)
            if (!formValidation[name].isValid(value)) this.setState({globalErrorMessage: formValidation[name].errorMessage});
            else this.setState({globalErrorMessage: ""});
        }
    }

    formIsValid(formData: FormData): boolean {
        let tempData: { fieldName: string, value: string }[] = getFormDataAsArray(formData);
        for (let elem of tempData) {
            const { fieldName, value } = elem;
            let result: boolean = formValidation?.[fieldName]?.isValid(value);
            if (result === false) {
                this.setGlobalErrorMessage(formValidation?.[fieldName]?.errorMessage);
                return false;
            }
        }
        this.setGlobalErrorMessage();
        return true
    }

    async saveAd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let formData = getFormData(event);
        let formIsValid = this.formIsValid(formData);
        if (formIsValid && this.state.images.length >= 2) {
            await createAd(formatCreationData(formData, this.state.selectedTags, this.props.idCustomer)).then((rep) => {
                const { errorMessage, result, adId } = rep?.data;
                if (result == 0) this.setGlobalErrorMessage(errorMessage);
                else {
                    let fileArray: File[] = []
                    this.state.images.map(elem => {
                        fileArray.push(elem.file);
                    })
                    saveAdImages(fileArray, adId);
                    this.setGlobalErrorMessage("Ad created...");
                    this.setState({ adWasCreated: true });
                    this.props.closeModalCallback();
                }
            })
        } else if (!(this.state.images.length >= 2) && formIsValid) {
            this.setGlobalErrorMessage("An ad must be created with at least 2 images!");
        }
    }

    render(): ReactNode {
        return (
            <div>
            <title>New ad</title>
                <button onClick={() => this.props.closeModalCallback()} className="AdCreationExitButton"><FontAwesomeIcon icon={faX} /></button>
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>
                    <AdCreationInput labelText="Title" name="title" type="text" required={false} iconProp={faItalic} onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <AdCreationInput labelText="Price" name="price" type="number" min={0} step={0.01} required={false} max={MAX_PRICE} iconProp={faReceipt} onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    <AdCreationInput labelText="Address" name="address" type="text" required={false} iconProp={faLocationDot} onChange={(changeEvent) => this.handleChange(changeEvent)} />
                    <div>
                        <IconLabelError iconProp={faScroll} title="Description" />
                        <textarea name="description" id="description" className="ad-modif-textarea" cols={30} rows={5} required={false} onChange={(changeEvent) => this.handleChange(changeEvent)}/>
                    </div>

                    <AdVisibilitySelect />
                    <AdShapeSelect />
                    <AdImages
                        error={this.state.errorImages}
                        setError={(errorImages) => this.setState({ errorImages })}
                        images={this.state.images}
                        removeImage={(link) => this.setState({ images: this.state.images.filter(img => img.link != link) })}
                        setImages={(images) => this.setState({ images })}
                    />

                    <AdTypeSelect inputName="type" inputId="type" />
                    <AdTags
                        error={this.state.errorAdTags}
                        setError={(error) => this.setState({ errorAdTags: error })}
                        addTag={(tag) => { this.setState({ selectedTags: [...this.state.selectedTags, tag] }) }}
                        deleteTag={(tag) => { this.setState({ selectedTags: [...this.state.selectedTags.filter(elem => elem != tag)] }) }}
                        tags={this.state.selectedTags}
                    />
                    <button type="submit" className="btn bg-primary text-white align-self-end mt-2">Create</button> <br />
                    <h5 className="text-center text-danger"><span>{this.state.globalErrorMessage}</span></h5>
                </form>
                {this.state.adWasCreated ? <Navigate to='/u/my-ads' /> : null}
            </div>
        )
    }
}