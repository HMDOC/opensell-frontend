import {Component, FormEvent, ReactNode} from "react";
import {SHAPE_ARRAY, VISIBILITY_ARRAY} from "../shared/SharedAdPart";
import {getFormData, getFormDataAsArray} from "../../services/customerModification/FormService";
import { getAllAdTypes } from "../../services/AdService";
import { AdTags } from "../shared/AdTags";
import { HtmlCode } from "../../services/verification/HtmlCode";
import { AdCreationInputProperties, AdCreationState, AdCreationpProperties, SelectorAdCreation, createAd, formValidation, formatCreationData} from "../../services/AdCreationService";
import { AdCreationData } from "../../entities/dto/adCreation/AdCreationData";

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
            selectedTags: []
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

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        //...
    }

    formIsValid(formData: FormData): boolean {
        //forEach of formData only returns undefined...
        let tempData: {key:string, value:string}[] = getFormDataAsArray(formData);
        for (let elem of tempData) {
            const {key, value} = elem;
            let result: boolean = formValidation?.[key]?.isValid(value);
            if (result) {
            } else if (result === false) {
                console.log(formValidation?.[key]?.isValid(value));
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
                else this.setGlobalErrorMessage("? : " + result);
            })
        } 
    }

    render(): ReactNode {
        return(
            <div className="main-background">
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>

                    <AdCreationInput labelText="Title : " name="title" type="text" required={true}/>
                    <AdCreationInput labelText="Price : " name="price" type="number" min={0} step={0.01} required={true} />
                    <AdCreationInput labelText="Address : " name="address" type="text" required={true} />
                    <AdCreationInput labelText="Reference : " name="reference" type="text" required={false} />
                    <div>
                        <label htmlFor="description">Destription : </label>
                        <textarea name="description" id="description" cols={30} rows={10} required={true}></textarea>
                    </div>
                    <SelectorAdCreation name="visibility" options={VISIBILITY_ARRAY}></SelectorAdCreation>
                    <SelectorAdCreation name="shape" options={SHAPE_ARRAY}></SelectorAdCreation>

                    <AdCreationInput labelText="Images : " name="images" type="file" accept="image/*" required={false}/>
                    <div>
                        <label htmlFor="type">Type : </label>
                        <select name="type">
                            {this.state.typeArray.map((elem, key) => (
                                <option value={elem.idAdType} key={key}>{elem.name}</option>
                            ))}
                        </select>
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