import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, Component, ReactNode, RefObject, createRef } from "react";
import { CustomerDto } from "../../entities/dto/CustomerDto";
import { AdCreationInputProperties } from "../AdCreationService";

export interface CMState {
    modalIsOpen: boolean;
    currentModalContent: ReactNode;
}

export interface CMProperties {
    customerData: CustomerDto;
    refreshCallback(): void;
}

export interface CMInputProperties extends AdCreationInputProperties {
    defaultValue?: string,
    cols?: number,
    rows?: number,
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>,
    onChange?(changeEvent: ChangeEvent<any>): void;
}

export interface CMRepeatInputProperties extends CMInputProperties {
    setRepeatInputState(isValid: boolean): void,
    addFeedbackMessage(message: string): void,
    removeFeedbackMessage(message: string): void
}

interface CMButtonProperties {
    type: "button" | "reset" | "submit",
    buttonText: string,
    isExitButton?: boolean,
    onClick?(event: any): void
}

export interface CMDisplayProperties {
    labelText: string;
    defaultValue?: string;
    isPassword?: boolean;
    hasButton?: boolean;
    buttonOnClickCallback?(): void
}

export interface CMFormProperties {
    defaultValues: CustomerDto,
    closeModalCallback(): void
}

export interface CMFormState {
    feedbackMessages: string[],
    confirmInputIsValid?: boolean
}

export class CMInput extends Component<CMInputProperties, any> {
    render(): ReactNode {
        return (
            <TextField
                label={this.props.labelText}
                id={this.props.name}
                {...this.props}
                ref={this.props.inputRef as RefObject<HTMLInputElement>}
                onChange={this.props.onChange ? (changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLInputElement>) : null}
            />
        )
    }
}

export class CMRepeatInput extends Component<CMRepeatInputProperties, any> {
    private INVALID_MESSAGE: string = "This value is not the same as the original input!";
    private inputRef: RefObject<HTMLInputElement> = createRef();

    public handleRepeatInputChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
        let isValid: boolean = changeEvent.target.value === this.inputRef.current.value;
        if (!isValid) this.props.addFeedbackMessage(this.INVALID_MESSAGE);
        else this.props.removeFeedbackMessage(this.INVALID_MESSAGE);
        this.props.setRepeatInputState(isValid);
    }

    render(): ReactNode {
        return (
            <>
                <CMInput labelText={this.props.labelText} name={this.props.name} type={this.props.type} inputRef={this.inputRef} onChange={(changeEvent) => this.props.onChange(changeEvent)} />
                <CMInput labelText={"Confirm " + this.props.labelText} name={null} type={this.props.type} onChange={(changeEvent) => this.handleRepeatInputChange(changeEvent)} />
            </>
        )
    }
}

export class CMTextArea extends CMInput {
    render(): ReactNode {
        return (
            <div className="modificationSection">
                <label className="modificationLabel" htmlFor={this.props.name}>{this.props?.labelText}</label>
                <textarea className="modificationInput modificationTextArea" id={this.props.name} name={this.props.name} defaultValue={this.props?.defaultValue}
                    onChange={(changeEvent: ChangeEvent<HTMLElement>) => this.props.onChange(changeEvent as ChangeEvent<HTMLTextAreaElement>)} cols={this.props.cols} rows={this.props.rows} />
            </div>
        )
    }
}

export class CMButton extends Component<CMButtonProperties, any> {
    render(): ReactNode {
        return (
            <div className="modificationSubmit">
                <button
                    className={"modificationLabel" + (this.props.isExitButton === true ? " CMExitButton" : "")}
                    type={this.props.type} onClick={this.props.isExitButton === true ? (e) => this.props.onClick(e) : null}>
                    {this.props.buttonText}
                </button>
            </div>
        );
    }
}

export function CMEditButton(props: { onClick: any, label: string }) {
    return (
        <Button onClick={props.onClick}>{props.label}</Button>
    );
}

export function CMContainer(props: { children: any, title: string, editButton?: any }) {
    return (
        <TableContainer component={Card} sx={{ borderRadius: "10px" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h5" fontWeight="bold">{props.title}</Typography>
                        </TableCell>

                        <TableCell></TableCell>

                        <TableCell align="right">
                            {props.editButton ?? <></>}
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {props.children}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export function CMDisplay(props: CMDisplayProperties) {
    const getDisplayedDefaultValue = () => {
        if (props.isPassword) return "***************"
        else if (props.defaultValue === null || props.defaultValue === "") return <span style={{ color: 'brown' }}>{"<Empty>"}</span>
        else return props.defaultValue;
    }

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
                <label>{props.labelText}</label>
            </TableCell>

            <TableCell align="left">
                {getDisplayedDefaultValue()}
            </TableCell>

            <TableCell align="right">
                {props.hasButton ?
                    (
                        <CMEditButton label="Edit" onClick={() => props.buttonOnClickCallback()} />
                    ) : (<></>)
                }
            </TableCell>
        </TableRow>
    )
}
