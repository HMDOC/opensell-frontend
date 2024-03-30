import { ChangeEvent, Component, FormEvent, ReactNode} from "react";
import {SelectorReader, SHAPE_ARRAY, VISIBILITY_ARRAY} from "../shared/SharedAdPart";
import {getFormData} from "../../services/customerModification/FormService";
import TagSelector from "./TagSelector";
import { AdTag } from "../../entities/dto/AdTag";
import {AdType} from "../../entities/dto/AdType";
import { getAllAdTags, getAllAdTypes } from "../../services/AdService";

/**
 * @author Olivier Mansuy
 */
const TEMPORARY_ID: number = 20;

interface AdCreationpProperties {

}

interface AdCreationState {
    errorMessage: string,
    tagArray: AdTag[]
    typeArray: AdType[]
}

interface AdCreationInputProperties {
    type: string,
    name: string,
    labelText: string,
    min?: number,
    max?: number,
    placeholder?: string,
    step?: number,
    accept?: string
}

class AdCreationInput extends Component<AdCreationInputProperties, any> {
    constructor(properties: AdCreationInputProperties) {
        super(properties)
    }

    render(): ReactNode {
        return(
            <div>
                <label htmlFor={this.props.name}>{this.props.labelText}</label>
                <input 
                type={this.props.type} 
                min={this.props.min} 
                max={this.props.max} 
                name={this.props.name} 
                id={this.props.name} 
                step={this.props.step}
                accept={this.props.accept}/>
            </div>
        )
    }
}

class SelectorAdCreation extends SelectorReader {

    public handleChange(e: ChangeEvent<HTMLSelectElement>): void {
        //
    }
}

export default class AdCreation extends Component<AdCreationpProperties, AdCreationState> {
    constructor(properties: AdCreationpProperties) {
        super(properties)
        this.state = {
            errorMessage: "",
            tagArray: [],
            typeArray: []
        }
    }

    getStringTagList(): Array<string> {
        let tags: string[] = [];
        for (let tag of this.state.tagArray) tags.push(tag.name);
        return tags;
    }

    getStringTypeList(): Array<string> {
        let types: string[] = [];
        for (let type of this.state.typeArray) types.push(type.name);
        return types;
    }


    componentDidMount(): void {
        getAllAdTags().then((rep) => {
            this.setState({
                ...this.state,
                tagArray: rep?.data
            })
            //if (res?.data) ... else ... navigate
        })
        getAllAdTypes().then((rep) => {
            this.setState({
                ...this.state,
                typeArray: rep?.data
            })
        })
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        
    }

    saveAd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (window.confirm("slt")) {
            let formData = getFormData(event);
            formData.forEach((value: string, key: string) => {
                console.log(key + " : " + value);
            })
        }

    }

    render(): ReactNode {
        return(
            <div className="main-background">
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>

                    <AdCreationInput labelText="Title : " name="title" type="text"/>
                    <AdCreationInput labelText="Price : " name="price" type="number" min={0} step={0.01}/>
                    <AdCreationInput labelText="Address : " name="address" type="text"/>
                    <AdCreationInput labelText="Reference : " name="reference" type="text"/>
                    <AdCreationInput labelText="Images : " name="images" type="file" accept="image/*"/>
                    <div>
                        <label htmlFor="description">Destription : </label>
                        <textarea name="description" id="description" cols={30} rows={10}></textarea>
                    </div>
                    <SelectorAdCreation name="visibility" options={VISIBILITY_ARRAY}></SelectorAdCreation>
                    <SelectorAdCreation name="shape" options={SHAPE_ARRAY}></SelectorAdCreation>
                    <TagSelector tagArray={this.getStringTagList()} showCatalogButtonText="Show tags" inputNameAttribute="tags"/>
                    <TagSelector tagArray={this.getStringTypeList()} showCatalogButtonText="Show types" inputNameAttribute="type" selectedTagsLimit={1}/>

                    <div><span>{this.state.errorMessage}</span></div>
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}