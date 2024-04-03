import { ChangeEvent, Component, FormEvent, ReactNode, createRef} from "react";
import {SelectorReader, SHAPE_ARRAY, VISIBILITY_ARRAY} from "../shared/SharedAdPart";
import {getFormData} from "../../services/customerModification/FormService";
import TagSelector from "./TagSelector";
import {AdType} from "../../entities/dto/AdType";
import { getAllAdTypes } from "../../services/AdService";
import { AdTags } from "../shared/AdTags";
import { HtmlCode } from "../../services/verification/HtmlCode";
import { AdCreationInputProperties, AdCreationState, AdCreationpProperties, SelectorAdCreation, isBetween } from "../../services/AdCreationService";

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
            adTags : [],
            errorAdTags: HtmlCode.SUCCESS,
            title: {errorMessage: "Title must be between 1 and 80 characters!", inputRef: createRef<HTMLInputElement>(), isValid: (value: string) => {return isBetween(value, 1, 80)}},
            description: {errorMessage: "Description can't be empty (5000 characters max)!", inputRef: createRef<HTMLTextAreaElement>(), isValid: (value: string) => {return isBetween(value, 1, 5000)}},
            price: {errorMessage: "Price can't negative!", inputRef: createRef<HTMLInputElement>(), isValid: (value: number) => {return value > 0}},
            address: {errorMessage: "Address can't be empty (80 characters)!", inputRef: createRef<HTMLInputElement>(), isValid: (value: string) => {return isBetween(value, 1, 80)}},
            reference: {errorMessage: "Too many characters!", inputRef: createRef<HTMLInputElement>(), isValid: (value: string) => {return value == null || value?.length < 80}},
            images: {errorMessage: "At least 1 image.", inputRef: createRef<HTMLInputElement>(), isValid: (value: []) => {return true}, isFileInput: true}

        }
    }

    getTypesAsStringList(): Array<string> {
        let types: string[] = [];
        for (let type of this.state.typeArray) types.push(type.name);
        return types;
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
        
    }

    formIsValid(): boolean {
        
        return true;
    }

    saveAd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (window.confirm("SEND?")) {
            if (this.formIsValid()) {
                // let formData = getFormData(event);
                // formData.forEach((value: string, key: string) => {
                //     console.log(key + " : " + value);
                // })
            }
        }

    }

    render(): ReactNode {
        return(
            <div className="main-background">
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>

                    <AdCreationInput labelText="Title : " name="title" type="text" required={true}/>
                    <AdCreationInput labelText="Price : " name="price" type="number" min={0} step={0.01} required={true}/>
                    <AdCreationInput labelText="Address : " name="address" type="text" required={true}/>
                    <AdCreationInput labelText="Reference : " name="reference" type="text" required={false}/>
                    <div>
                        <label htmlFor="description">Destription : </label>
                        <textarea name="description" id="description" cols={30} rows={10} required={true}></textarea>
                    </div>
                    <SelectorAdCreation name="visibility" options={VISIBILITY_ARRAY}></SelectorAdCreation>
                    <SelectorAdCreation name="shape" options={SHAPE_ARRAY}></SelectorAdCreation>
                    <AdCreationInput labelText="Images : " name="images" type="file" accept="image/*" required={false}/>

                    <TagSelector 
                        tagArray={this.getTypesAsStringList()} 
                        showCatalogButtonText="Show types" 
                        inputNameAttribute="type" 
                        selectedTagsLimit={1} 
                        tagCatalogLabel="Types"
                    />

                    <AdTags
                        error={this.state.errorAdTags}
                        setError={(error) => this.setState({errorAdTags: error})}
                        addTag={(tag) => this.setState({adTags: [...this.state.adTags, tag]})}
                        deleteTag={(tag) => this.setState({adTags: this.state.adTags.filter(t => t != tag)})}
                        tags={this.state.adTags}
                    />

                    <div><span>{this.state.globalErrorMessage}</span></div>
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}