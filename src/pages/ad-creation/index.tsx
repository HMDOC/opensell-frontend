import { AdType } from "@entities/dto/AdType";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@pages/ad-modification";
import "@pages/ad-modification/style.scss";
import AdTypeSelect from "@shared/AdTypeSelect";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { ObjectSchema, StringSchema } from "yup";
import AdShapeSelect from "../../components/shared/AdShapeSelect";
import { AdTags, AdTagsError } from "../../components/shared/AdTags";
import AdVisibilitySelect from "../../components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "../../components/shared/SharedAdPart";
import { AdCreationInput } from "./components/ad-creation-input";
import { getAllAdTypes } from "@services/AdService";
import { AdImages } from "../../components/ad-images";

interface AdCreationModalProperties {
    idCustomer: number;
    isOpen: boolean;
    onCloseRequest(): void;
}

export default function AdCreationModal(props: AdCreationModalProperties) {
    const [adTypeArray, setAdTypeArray] = useState<AdType[]>();
    const [errorAdTags, setErrorAdTags] = useState<AdTagsError>("NONE");
    const [selectedTags, setSelectedTags] = useState<AdTagsError>("NONE");
    const [images, setImages] = useState();
    const [errorImages, setErrorImages] = useState();
    const [adWasCreated, setAdWasCreated] = useState(false);

    useEffect(() => {
        getAllAdTypes().then((res) => {
            setAdTypeArray(res?.data)
        })
    }, []);

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onCloseRequest}
            maxWidth={false}
        >
            <DialogTitle variant="h4">Create Ad</DialogTitle>

            <DialogContent>
                <Formik
                    initialValues={{
                        title: "",
                        price: "",
                        description: "",
                        address: "",
                        adTypeId: "",
                        visibility: 0,
                        shape: ""
                    }}
                    validationSchema={
                        new ObjectSchema({
                            title: notEmptyWithMaxAndMin(80, 3, "Title"),
                            price: priceWithMinAndMax(MAX_PRICE, 0, "Price"),
                            description: notEmptyWithMaxAndMin(5000, 10, "Description"),
                            address: notEmptyWithMaxAndMin(256, 4, "Address"),
                            adTypeId: new StringSchema().required("Category is required."),
                            visibility: new StringSchema().required("Visibility is required."),
                            shape: new StringSchema().required("Shape is required.")
                        })}
                    onSubmit={(values) => {
                        console.log("SUBMITTED!");
                        console.log(values);
                        setAdWasCreated(true);
                        alert("Refactoring in progress!");
                    }}
                >
                    <Form id="create-ad">
                        <Stack spacing={3}>
                            <Field name="title" component={AdCreationInput} label="Title" />
                            <Field name="price" type="number" component={AdCreationInput} label="Price" />
                            <Field name="description" component={AdCreationInput} label="Description" isTextArea />
                            <Field name="address" component={AdCreationInput} label="Address" icon={<LocationOnIcon />} />

                            <Field name="visibility" component={AdVisibilitySelect} />
                            <Field name="shape" component={AdShapeSelect} />

                            {/* Refactoring in progress */}
                            {/* <AdImages
                                error={this.state.errorImages}
                                setError={(errorImages) => this.setState({ errorImages })}
                                images={this.state.images}
                                removeImage={(link) => this.setState({ images: this.state.images.filter(img => img.link !== link) })}
                                setImages={(images) => this.setState({ images })}
                            /> */}

                            <Field name="adTypeId" component={AdTypeSelect} />

                            {/* Refactoring in progress */}
                            {/* <AdTags
                                error={this.state.errorAdTags}
                                setError={(error) => this.setState({ errorAdTags: error })}
                                addTag={(tag) => { this.setState({ selectedTags: [...this.state.selectedTags, tag] }) }}
                                deleteTag={(tag) => { this.setState({ selectedTags: this.state.selectedTags.filter(elem => elem !== tag) }) }}
                                tags={this.state.selectedTags}
                            /> */}
                        </Stack>
                    </Form >
                </Formik >
            </DialogContent>

            <DialogActions>
                <Button variant="text" onClick={props.onCloseRequest}>Cancel</Button>
                <Button type="submit" variant="contained" form="create-ad">{"Create"}</Button>
            </DialogActions>
        </Dialog>
    );
}