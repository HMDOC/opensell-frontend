import { ChangeEvent, Component, ReactNode } from "react"
import { AdCreationInputProperties } from "../AdCreationService"
import { CustomerModificationView } from "../../entities/dto/CustomerModificationView"


interface CustomerModificationInputProperties extends AdCreationInputProperties {
    onChange?(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>): void,
    defaultValue?: string,
    cols?: number,
    rows?: number,
    numberOfLinks?: number,
    defaultValues?: CustomerModificationView
}

export class CustomerModificationInput extends Component<CustomerModificationInputProperties, any> {
    render(): ReactNode {
        return(
            <div className="modificationSection">
                <label className="modificationLabel" htmlFor={this.props.name}>{this.props?.labelText}</label>
                <input className="modificationInput" id={this.props.name} type={this.props.type} name={this.props.name} defaultValue={this.props?.defaultValue} 
                onChange={(changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLInputElement>)}/>
            </div>
        )
    }
}

export class CustomerModificationTextArea extends CustomerModificationInput {
    render(): ReactNode {
        return(
            <div className="modificationSection">
                <label className="modificationLabel" htmlFor={this.props.name}>{this.props?.labelText}</label>
                <textarea className="modificationInput modificationTextArea" id={this.props.name} name={this.props.name} defaultValue={this.props?.defaultValue} 
                onChange={(changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLTextAreaElement>)} cols={this.props.cols} rows={this.props.rows}/>
            </div>
        )
    }
}

export class CustomerModificationSocials extends Component<CustomerModificationInputProperties, any> {
    private getNumberArray(): number[] {
        let numbers: number[] = [];
        for (let elem = 1; elem < this.props?.numberOfLinks + 1; elem++) numbers.push(elem);
        return numbers;
    }
    render(): ReactNode {
        return(
            <div className="modificationSection modificationSocials">
                <label className="modificationLabel">{this.props.labelText}</label>
                {this.getNumberArray().map((elem: number) => (
                    <CustomerModificationInput 
                    labelText="" 
                    type="text" 
                    name={this.props.name + elem} 
                    key={elem} 
                    defaultValue={this.props.defaultValues?.[this.props.name + elem]}
                    onChange={(changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLTextAreaElement>)}
                    />
                ))}
            </div>
        );
    }
}

export class CustomerModificationButton extends Component<{type: "button" | "reset" | "submit", buttonText: string}, any> {
    render(): ReactNode {
        return(
            <div className="modificationSubmit">
                <button className="modificationLabel" type={this.props.type}>{this.props.buttonText}</button>
            </div>
        );
    }
}