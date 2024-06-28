import { MUI_INPUT_VARIANT } from "@context/AppContext";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { MenuItem, TextField } from "@mui/material";
import { AxiosError } from "axios";
import { ChangeEvent, Component, ReactNode } from "react";
import { AdType } from "../../entities/dto/AdType";
import { getAllAdTypes } from "../../services/AdService";
import IconLabelError from "./part/IconLabelError";

interface AdTypeSelectProperties {
    inputId: string;
    inputName: string;
    defaultOptionText?: string;

    /**
     * @Note ad modif 
     */
    isModification?: boolean;
    selectedIndex?: number;
    cName?: string;
    externalOnChange?(adType: AdType): void;
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
            typeArray: undefined
        }
    }

    //ad modif
    //https://stackoverflow.com/questions/14976495/get-selected-option-text-with-javascript
    handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const { value, options, selectedIndex } = event.target;
        this.props.externalOnChange?.({ idAdType: parseInt(value), name: options[selectedIndex].text });
    }

    setTypeArray(array: AdType[]): void {
        this.setState({ ...this.state, typeArray: array });
    }

    componentDidMount(): void {
        getAllAdTypes().then((rep) => {
            let array = rep?.data;
            
            if(this.props.defaultOptionText) {
                array = [{idAdType : "" as any, name : this.props.defaultOptionText}, ...array]
            }
            
            if (rep?.data) this.setTypeArray(array);
        }).catch((error: AxiosError) => { this.setTypeArray([{ idAdType: 1, name: "No tags found..." }]); }
        );
    }

    render(): ReactNode {
        return (
            <>
                {!this.props.isModification || (this.state.typeArray && this.props.selectedIndex) ?
                    (
                        <>
                            <TextField
                                id={this.props.inputId}
                                name={this.props.inputName}
                                label={
                                    <IconLabelError iconProp={faList} title="Category" />
                                }
                                defaultValue={this.props.selectedIndex ?? ""}
                                variant={MUI_INPUT_VARIANT}
                                sx={{
                                    width: 200
                                }}
                                onChange={this.props.isModification ? (event) => { this.handleChange(event as any) } : undefined}
                                select
                            >
                                {this.state.typeArray?.map((type, key) => (
                                    <MenuItem value={type.idAdType} key={key}>{type.name}</MenuItem>
                                ))}
                            </TextField>
                        </>
                    )
                    :
                    <></>}
            </>

        )
    }
}