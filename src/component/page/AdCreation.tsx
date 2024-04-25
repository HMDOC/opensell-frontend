import { Component, FormEvent, ReactNode } from "react";
import { AdCreationInputProperties, AdCreationState, AdCreationpProperties, createAd, formValidation, formatCreationData } from "../../services/AdCreationService";
import { getAllAdTypes, saveAdImages } from "../../services/AdService";
import { getFormData, getFormDataAsArray } from "../../services/FormService";
import { HtmlCode } from "../../services/verification/HtmlCode";
import { AdImages } from "../shared/AdImages";
import { AdTags } from "../shared/AdTags";
import AdTypeSelect from "../shared/AdTypeSelect";
import { Navigate } from "react-router-dom";
import { MAX_PRICE, SHAPE_ARRAY, SelectorReader, VISIBILITY_ARRAY } from "../shared/SharedAdPart";
import "../../css/component/page/CustomerModification.css"

/**
 * @author Olivier Mansuy
 */
class AdCreationInput extends Component<AdCreationInputProperties, any> {
    constructor(properties: AdCreationInputProperties) {
        super(properties)
    }
    render(): ReactNode {
        return(
            <div className="row">
                <label htmlFor={this.props.name} className="col">{this.props.labelText}</label>
                <input
                className="modificationInput col-9"
                type={this.props.type}
                min={this.props.min}
                max={this.props.max}
                name={this.props.name}
                id={this.props.name}
                step={this.props.step}
                accept={this.props.accept}
                required={this.props.required}
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
            images : [],
            errorImages: "",
            adWasCreated: false
        }
    }

    setGlobalErrorMessage(error?: string) {
        this.setState({...this.state, globalErrorMessage: error ? error : ""});
    }

    componentDidMount(): void {
        getAllAdTypes().then((rep) => {
            this.setState({
                ...this.state,
                typeArray: rep?.data
            })
        })
    }

    formIsValid(formData: FormData): boolean {
        //forEach of formData only returns undefined...
        let tempData: {fieldName:string, value:string}[] = getFormDataAsArray(formData);
        for (let elem of tempData) {
            const {fieldName, value} = elem;
            let result: boolean = formValidation?.[fieldName]?.isValid(value);
            console.log(fieldName + " " + result + " VALUE : " + value)
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
        if (window.confirm("Are you sure?") && this.formIsValid(formData)) {
            await createAd(formatCreationData(formData, this.state.selectedTags, this.props.idCustomer)).then((rep) => {
                const {code, errorMessage, result, adId} = rep?.data;
                if (result == 0) this.setGlobalErrorMessage(errorMessage);
                else {
                    let fileArray: File[] = []
                    this.state.images.map(elem => {
                        fileArray.push(elem.file);
                    }) 
                    console.log(fileArray);
                    saveAdImages(fileArray, adId);
                    this.setGlobalErrorMessage("Ad created...");
                    this.setState({adWasCreated: true});
                }
            })
        }
    }

    render(): ReactNode {
        return(
            <div className="reg-background container">
                <h5 className="text-center text-danger"><span>{this.state.globalErrorMessage}</span></h5>
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>
                    <AdCreationInput labelText="Title : " name="title" type="text" required={false}/>
                    <AdCreationInput labelText="Price : " name="price" type="number" min={0} step={0.01} required={false} max={MAX_PRICE}/>
                    <AdCreationInput labelText="Address : " name="address" type="text" required={false} />
                    <div className="row">
                        <label htmlFor="description" className="col">Description : </label>
                        <textarea name="description" id="description" className="modificationInput col-9" cols={30} rows={5} required={false}></textarea>
                    </div>
                    <SelectorReader name="visibility" options={VISIBILITY_ARRAY} />
                    <SelectorReader name="shape" options={SHAPE_ARRAY} />
                    <AdImages
                        error={this.state.errorImages}
                        setError={(errorImages) => this.setState({errorImages})}
                        images={this.state.images}
                        removeImage={(link) => this.setState({images: this.state.images.filter(img => img.link != link)})}
                        setImages={(images) => this.setState({images})}
                    />
                    <div className="row">
                        <label htmlFor="type" className="col">Type : </label>
                        <AdTypeSelect inputName="type" inputId="type" cName="modificationInput col-9"/>
                    </div>
                    <AdTags
                        error={this.state.errorAdTags}
                        setError={(error) => this.setState({errorAdTags: error})}
                        addTag={(tag) => {this.setState({selectedTags: [...this.state.selectedTags, tag]})}}
                        deleteTag={(tag) => {this.setState({selectedTags: [...this.state.selectedTags.filter(elem => elem != tag)]})}}
                        tags={this.state.selectedTags}
                    />
                    <button type="submit" className="btn bg-primary text-white align-self-end">Create</button> <br />
                </form>
                {this.state.adWasCreated ? <Navigate to='/u/my-ads'/> : null}
            </div>
        )
    }
}