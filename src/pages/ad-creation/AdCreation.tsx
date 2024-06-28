import { faDollar, faItalic, faLocationDot, faScroll, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@pages/ad-modification";
import "@pages/ad-modification/style.scss";
import { AxiosError, HttpStatusCode } from "axios";
import { ChangeEvent, Component, FormEvent, ReactNode, useState } from "react";
import { Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { AdImages } from "../../components/ad-images";
import AdShapeSelect from "../../components/shared/AdShapeSelect";
import { AdTags } from "../../components/shared/AdTags";
import AdTypeSelect from "../../components/shared/AdTypeSelect";
import AdVisibilitySelect from "../../components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "../../components/shared/SharedAdPart";
import IconLabelError from "../../components/shared/part/IconLabelError";
import { AdCreationInputProperties, AdCreationState, AdCreationpProperties, formValidation, v2CreateAd } from "../../services/AdCreationService";
import { getAllAdTypes } from "../../services/AdService";
import { getFormData, getFormDataAsArray } from "../../services/FormService";
import PaidIcon from '@mui/icons-material/Paid';
import { MUI_INPUT_VARIANT } from "@context/AppContext";
import { Icon, TextField } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SellIcon from '@mui/icons-material/Sell';
/**
 * @author Olivier Mansuy
 */
export function AdCreationInput(props: AdCreationInputProperties) {
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        props.validateSchema
            .validate(e.target.value)
            .then(() => {
                if (!!error) {
                    setError("");
                    props.changeErrorKeys(props.name, true);
                }
            })
            .catch(ex => {
                if (ex != error) {
                    setError(ex.message);
                    props.changeErrorKeys(props.name);
                }
            })

            ;
    };

    return (
        <>
            <TextField
                label={
                    <label style={{display : "flex", justifyContent : "center", alignItems : "center"}}>
                        {props.icon}
                        {props.labelText}
                    </label>
                }
                error={!!error}
                multiline={props.isTextArea}
                rows={props.isTextArea ? 10 : undefined}
                type={props.type ?? "text"}
                variant={MUI_INPUT_VARIANT}
                helperText={error}
                sx={{width : props.isTextArea ? "1000px" : "300px"}}
                name={props.name}
                onChange={handleChange}
            />

            <br />
            <br />
        </>
    )
}

export default class AdCreation extends Component<AdCreationpProperties, AdCreationState> {
    state: AdCreationState = {
        globalErrorMessage: "",
        typeArray: [],
        errorAdTags: "NONE",
        selectedTags: [],
        images: [],
        errorImages: "",
        adWasCreated: false,
        errorKeys: new Array<string>()
    }

    setGlobalErrorMessage(error?: string) {
        this.setState({ globalErrorMessage: error ? error : "" });
    }

    componentDidMount(): void {
        getAllAdTypes().then((rep) => {
            this.setState({ typeArray: rep?.data })
        })
    }

    private handleChange(changeEvent: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
        const { value, name } = changeEvent.currentTarget;
        if (formValidation[name]) {
            console.log(value)
            if (!formValidation[name].isValid(value)) this.setState({ globalErrorMessage: formValidation[name].errorMessage });
            else this.setState({ globalErrorMessage: "" });
        }
    }

    private changeErrorKeys(key: string, isRemove?: boolean) {
        if (isRemove) {
            this.setState({ errorKeys: this.state.errorKeys.filter(e => e != key) });
        }

        else {
            this.setState({ errorKeys: [...this.state.errorKeys, key] });
        }
    }

    formIsValid(formData: FormData): boolean {
        let tempData: { fieldName: string, value: string }[] = getFormDataAsArray(formData);
        for (let elem of tempData) {
            const { fieldName, value } = elem;
            let result: boolean = formValidation?.[fieldName]?.isValid(value);
            if (result === false) {
                this.setGlobalErrorMessage(formValidation?.[fieldName]?.errorMessage);
                return false;
            }
        }
        this.setGlobalErrorMessage();
        return true
    }

    async saveAd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let formData = getFormData(event);
        let formIsValid = this.formIsValid(formData);
        if (formIsValid && this.state.images.length >= 2) {
            this.state.images.forEach(elem => formData.append("images", elem.file));
            formData.append("tags", JSON.stringify(this.state.selectedTags));
            formData.append("isSold", `${true}`);
            formData.append("customerId", `${this.props.idCustomer}`);

            await v2CreateAd(formData).then(
                res => {
                    if (res.status == HttpStatusCode.Ok) {
                        this.setState({ adWasCreated: true });
                        this.props.closeModalCallback();
                    }
                }
            ).catch((error: AxiosError) => {
                // IT IS NOT FIXED YET.
                this.setGlobalErrorMessage((error.response.data as any).message);
            });
        } else if (!(this.state.images.length >= 2) && formIsValid) {
            this.setGlobalErrorMessage("An ad must be created with at least 2 images!");
        }
    }

    render(): ReactNode {
        return (
            <div>
                <button onClick={() => this.props.closeModalCallback()} className="AdCreationExitButton"><FontAwesomeIcon icon={faX} /></button>
                <br /><br />

                <form onSubmit={(formEvent) => this.saveAd(formEvent)}>
                    <AdCreationInput changeErrorKeys={(key, isRemove) => this.changeErrorKeys(key, isRemove)} labelText="Title" name="title" type="text" validateSchema={notEmptyWithMaxAndMin(80, 3, "Title")} />
                    <AdCreationInput changeErrorKeys={(key, isRemove) => this.changeErrorKeys(key, isRemove)} labelText="Price" name="price" type="number" min={0} step={0.01} max={MAX_PRICE} validateSchema={priceWithMinAndMax(MAX_PRICE, 0, "Price")} />
                    <AdCreationInput changeErrorKeys={(key, isRemove) => this.changeErrorKeys(key, isRemove)} labelText="Description" name="description" isTextArea validateSchema={notEmptyWithMaxAndMin(5000, 10, "Description")} />
                    <AdCreationInput changeErrorKeys={(key, isRemove) => this.changeErrorKeys(key, isRemove)} labelText="Address" name="address" type="text" icon={<LocationOnIcon />} validateSchema={notEmptyWithMaxAndMin(256, 4, "Address")} />

                    <AdVisibilitySelect />
                    <AdShapeSelect />
                    <AdImages
                        error={this.state.errorImages}
                        setError={(errorImages) => this.setState({ errorImages })}
                        images={this.state.images}
                        removeImage={(link) => this.setState({ images: this.state.images.filter(img => img.link !== link) })}
                        setImages={(images) => this.setState({ images })}
                    />
                    <br />

                    <AdTypeSelect inputName="adTypeId" inputId="adTypeId" />
                    <br />
                    <br />

                    <AdTags
                        error={this.state.errorAdTags}
                        setError={(error) => this.setState({ errorAdTags: error })}
                        addTag={(tag) => { this.setState({ selectedTags: [...this.state.selectedTags, tag] }) }}
                        deleteTag={(tag) => { this.setState({ selectedTags: this.state.selectedTags.filter(elem => elem !== tag) }) }}
                        tags={this.state.selectedTags}
                    />
                    <br />

                    <Button disabled={this.state.errorKeys.length != 0} type="submit">Create</Button>
                    <br />
                    <h5 className="text-center text-danger"><span>{this.state.globalErrorMessage}</span></h5>
                </form>
                {this.state.adWasCreated ? <Navigate to='/u/my-ads' /> : null}
            </div>
        )
    }
}