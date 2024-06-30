import AdShapeSelect from "@components/shared/AdShapeSelect";
import { AdTagsError } from "@components/shared/AdTags";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@pages/ad-modification";
import AdTypeSelect from "@shared/AdTypeSelect";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { object, string } from "yup";
import { AdCreationInput } from "./components/ad-creation-input";

interface AdCreationModalProperties {
    idCustomer: number;
    isOpen: boolean;
    onCloseRequest(): void;
}

export default function AdCreationModal(props: AdCreationModalProperties) {
    // These useState are temporary their. They will be removed after fixing AdImages and AdTags with Formik.
    const [errorAdTags, setErrorAdTags] = useState<AdTagsError>("NONE");
    const [selectedTags, setSelectedTags] = useState<AdTagsError>("NONE");
    const [images, setImages] = useState();
    const [errorImages, setErrorImages] = useState();

    const initialValues = {
        title: "",
        price: "",
        description: "",
        address: "",
        adTypeId: "",
        visibility: 0,
        shape: ""
    };

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onCloseRequest}
            maxWidth={false}
            PaperProps={{ sx: { borderRadius: "10px" } }}
        >
            <DialogTitle variant="h5" sx={{fontWeight : "bold"}}>Create Ad</DialogTitle>
            <Divider />

            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={
                        object({
                            title: notEmptyWithMaxAndMin(80, 3, "Title"),
                            price: priceWithMinAndMax(MAX_PRICE, 0, "Price"),
                            description: notEmptyWithMaxAndMin(5000, 10, "Description"),
                            address: notEmptyWithMaxAndMin(256, 4, "Address"),
                            adTypeId: string().required("Category is required."),
                            visibility: string().required("Visibility is required."),
                            shape: string().required("Shape is required.")
                        })}
                    onSubmit={(values) => {
                        console.log("SUBMITTED!");
                        console.log(values);
                        alert("Refactoring in progress!");
                        props.onCloseRequest();
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
            <Divider />

            <DialogActions>
                <Button variant="text" onClick={props.onCloseRequest}>Cancel</Button>
                <Button type="submit" variant="contained" form="create-ad">{"Create"}</Button>
            </DialogActions>
        </Dialog>
    );
}