import { Component, FormEvent, ReactNode} from "react";

const TEMPORARY_ID: number = 20;

interface AdCreationpProperties {

}

interface AdCreationState {
   
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
        if (window.confirm("slt")) {

        }

    }

    render(): ReactNode {
        return(
            <div>
                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>
                    <p>NFAOWUBFAWUBFAW</p>

                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}