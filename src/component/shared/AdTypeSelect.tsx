import { ChangeEvent, Component, ReactNode } from "react";
import { AdType } from "../../entities/dto/AdType";
import { getAllAdTypes } from "../../services/AdService";
import { AxiosError } from "axios";

interface AdTypeSelectProperties {
    inputId: string,
    inputName: string,
    defaultOptionText?: string,
    defaultOptionValue?: any,

    /**
     * @Note ad modif 
     */
    externalTypeValue?: AdType
    externalOnChange?(adType: AdType): void
}

interface AdTypeSelectState {
    typeArray: AdType[]
}

/**
 * @author Olivier mansuy
 */
export default class AdTypeSelect extends Component<AdTypeSelectProperties, AdTypeSelectState> {
    constructor(properties: AdTypeSelectProperties) {
        super(properties)
        this.state = {
            typeArray: []
        } 
    }

    //ad modif
    //https://stackoverflow.com/questions/14976495/get-selected-option-text-with-javascript
    handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const {value, options, selectedIndex} = event.target;
        this.props.externalOnChange({idAdType: parseInt(value), name: options[selectedIndex].text});
    }

    setTypeArray(array: AdType[]): void {
        this.setState({...this.state, typeArray: array});
    }

    componentDidMount(): void {
        getAllAdTypes().then((rep) => {
            if (rep?.data) this.setTypeArray(rep?.data);
        }).catch((error:AxiosError) => {
            this.setTypeArray([{idAdType: 1, name: "No tags found..."}]);
        });
    }

    render(): ReactNode {
        return(
            <select 
            id={this.props.inputId} 
            name={this.props.inputName} 
            onChange={this.props.externalTypeValue ? (event: ChangeEvent<HTMLSelectElement>) => {this.handleChange(event)} : null}>

                {this.props.defaultOptionText ? <option value={this.props.defaultOptionValue} selected>{this.props.defaultOptionText}</option> : null}
                {this.state.typeArray.map((type, key) => (
                    <option value={type.idAdType} key={key}>{type.name}</option>
                ))}

            </select>
        )
    }
}