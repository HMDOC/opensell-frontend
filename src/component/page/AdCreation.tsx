import { ChangeEvent, Component, FormEvent, ReactNode} from "react";
import {SelectorReader, SHAPE_ARRAY, VISIBILITY_ARRAY} from "../shared/SharedAdPart";
import {getFormData} from "../../services/customerModification/FormService";

const TEMPORARY_ID: number = 20;

interface AdCreationpProperties {

}

interface AdCreationState {
   
}

class SelectorAdCreation extends SelectorReader {

    public handleChange(e: ChangeEvent<HTMLSelectElement>): void {
        //
    }
}

//https://github.com/uberVU/react-guide/blob/master/props-vs-state.md
export default class AdCreation extends Component<AdCreationpProperties, AdCreationState> {
    constructor(properties: AdCreationpProperties) {
        super(properties)
        this.state = {
          
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        
    }

    saveAd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let formData = getFormData(event);
        if (window.confirm("slt")) {
            console.log(formData.get("shape"));
            console.log(formData.get("visibility"));
        }

    }

    render(): ReactNode {
        return(
            <div>
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>

                    <SelectorAdCreation name="visibility" options={VISIBILITY_ARRAY}></SelectorAdCreation>
                    <SelectorAdCreation name="shape" options={SHAPE_ARRAY}></SelectorAdCreation>
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}