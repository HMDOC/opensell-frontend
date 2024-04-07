import {Component, FormEvent, ReactNode} from "react";
import {MAX_PRICE, SelectorReader, SHAPE_ARRAY, VISIBILITY_ARRAY} from "../shared/SharedAdPart";
import {getFormData, getFormDataAsArray} from "../../services/customerModification/FormService";
import { getAllAdTypes } from "../../services/AdService";
import { AdTags } from "../shared/AdTags";
import { HtmlCode } from "../../services/verification/HtmlCode";
import { AdCreationInputProperties, AdCreationState, AdCreationpProperties, createAd, formValidation, formatCreationData} from "../../services/AdCreationService";
import AdTypeSelect from "../shared/AdTypeSelect";
import { AdImages } from "../shared/AdImages";

/**
 * @author Olivier Mansuy
 */
const TEMPORARY_ID: number = 20;

class AdCreationInput extends Component<AdCreationInputProperties, any> {
    constructor(properties: AdCreationInputProperties) {
        super(properties)
    }
    render(): ReactNode {
        return(
            <div className="">
                <label htmlFor={this.props.name} className="">{this.props.labelText}</label>
                <input
                className=""
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
            images : []
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
        let tempData: {key:string, value:string}[] = getFormDataAsArray(formData);
        for (let elem of tempData) {
            const {key, value} = elem;
            let result: boolean = formValidation?.[key]?.isValid(value);
            console.log(key + " " + result + " VALUE : " + value)
            if (result === false) {
                this.setGlobalErrorMessage(formValidation?.[key]?.errorMessage);
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
            await createAd(formatCreationData(formData, this.state.selectedTags, TEMPORARY_ID)).then((rep) => {
                const {code, errorMessage, result} = rep?.data;
                if (result == 0) this.setGlobalErrorMessage(errorMessage);
                else this.setGlobalErrorMessage("LOG(TEST) : Fields inserted : " + result);
            })
        }
    }

    render(): ReactNode {
        console.log("The ad images : "+this.state.images.length)
        return(
            <div className="main-background">
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>

                    <AdCreationInput labelText="Title : " name="title" type="text" required={false}/>
                    <AdCreationInput labelText="Price : " name="price" type="number" min={0} step={0.01} required={false} max={MAX_PRICE}/>
                    <AdCreationInput labelText="Address : " name="address" type="text" required={false} />
                    <AdCreationInput labelText="Reference : " name="reference" type="text" required={false} />
                    <div>
                        <label htmlFor="description">Destription : </label>
                        <textarea name="description" id="description" cols={30} rows={10} required={false}></textarea>
                    </div>
                    <SelectorReader name="visibility" options={VISIBILITY_ARRAY} />
                    <SelectorReader name="shape" options={SHAPE_ARRAY} />

                    {/* <AdCreationInput labelText="Images : " name="images" type="file" accept="image/*" required={false}/> */}
                    <AdImages 
                        creationImages={this.state.images}
                        updateCreationImages={(id, isDeleted, file?) => {
                            if(isDeleted) {
                                this.setState({images : this.state.images.filter(img => img.id == id)})
                            } else {
                                this.setState({images : [...this.state.images, {file, id}]})
                            }
                        }}


                    />
                    <div>
                        <label htmlFor="type">Type : </label>
                        <AdTypeSelect inputName="type" inputId="type"/>
                    </div>

                    <AdTags
                        error={this.state.errorAdTags}
                        setError={(error) => this.setState({errorAdTags: error})}
                        addTag={(tag) => {this.setState({selectedTags: [...this.state.selectedTags, tag]})}}
                        deleteTag={(tag) => {this.setState({selectedTags: [...this.state.selectedTags.filter(elem => elem != tag)]})}}
                        tags={this.state.selectedTags}
                    />

                    <div><span>{this.state.globalErrorMessage}</span></div>
                    <button type="submit">Create</button>
                </form>
            </div>
        )
    }
}