import { AdImages } from "@components/ad-images";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import { AdTags } from "@components/shared/AdTags";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@pages/ad-modification";
import AdTypeSelect from "@shared/AdTypeSelect";
import { Field, Form, Formik } from "formik";
import { array, object, string } from "yup";
import { AdCreationInput } from "./components/ad-creation-input";

interface AdCreationModalProperties {
    idCustomer: number;
    isOpen: boolean;
    onCloseRequest(): void;
}

export default function AdCreationModal(props: AdCreationModalProperties) {
    const initialValues = {
        title: "",
        price: "",
        description: "",
        address: "",
        adTypeId: "",
        visibility: 0,
        shape: "",
        tags: [],
        images: []
    };

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onCloseRequest}
            maxWidth={false}
            PaperProps={{ sx: { borderRadius: "10px" } }}
        >
            <DialogTitle variant="h5" sx={{ fontWeight: "bold" }}>Create Ad</DialogTitle>
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
                            shape: string().required("Shape is required."),
                            tags: array().min(3, "Tags should be at least 3."),
                            images: array().min(2, " should be at least 2.")
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

                            <AdImages name="images" />

                            <Field name="adTypeId" component={AdTypeSelect} />

                            <AdTags name="tags" />
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