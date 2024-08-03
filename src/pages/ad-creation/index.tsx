import { AdImages } from "@components/shared/ad/images";
import { AdTags } from "@components/shared/ad/tags";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { useAppContext } from "@context/AppContext";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { createAd, isTitleConstraintOk, saveImages, updateAd } from "@services/ad/listings";
import AdCreatorDto from "@services/ad/listings/dto/AdCreatorDto";
import AdTypeSelect from "@shared/AdTypeSelect";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@utils/yupSchema";
import { HttpStatusCode } from "axios";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { array, object, string } from "yup";
import { FrontendImage, ImageBox } from "../../model/dto/v2/ImageBox";
import { AdCheckbox } from "./components/ad-checkbox";
import { AdCreationInput } from "./components/ad-creation-input";

interface AdCreationModalProps {
    open: boolean;
    onClose(isChange?: boolean): void;
    adCreator?: AdCreatorDto;
}

const TITLE_ALREADY_EXISTS = "You already have used this title in another ad.";

export default function AdCreationModal(props: AdCreationModalProps) {
    const { customerDto } = useAppContext();
    const isUpdate: boolean = props.adCreator != undefined;
    const [alreadyExistingTitles, setAlreadyExistingTitles] = useState<string[]>([]);

    const initialValues = {
        title: props.adCreator?.title ?? "",
        price: props.adCreator?.price ?? "",
        description: props.adCreator?.description ?? "",
        address: props.adCreator?.address ?? "",
        adTypeId: props.adCreator?.adTypeId ?? "",
        visibility: props.adCreator?.visibility ?? 0,
        shape: props.adCreator?.shape ?? "",
        tags: props.adCreator?.tags ?? [],
        images: props.adCreator?.images as ImageBox[] ?? new Array<ImageBox>(),
        sold: props.adCreator?.sold ?? false,
    };

    return (
        <Dialog
            open={props.open}
            onClose={() => props.onClose()}
            fullScreen
        >
            <Formik
                initialValues={initialValues}
                validationSchema={
                    object({
                        title: notEmptyWithMaxAndMin(80, 3, "Title").notOneOf(alreadyExistingTitles, TITLE_ALREADY_EXISTS),
                        price: priceWithMinAndMax(MAX_PRICE, 0, "Price"),
                        description: notEmptyWithMaxAndMin(5000, 10, "Description"),
                        address: notEmptyWithMaxAndMin(256, 4, "Address"),
                        adTypeId: string().required("Category is required."),
                        visibility: string().required("Visibility is required."),
                        shape: string().required("Shape is required."),
                        images: array().min(2, " should be at least 2."),
                    })}
                onSubmit={async (values, formikHelpers) => {
                    if (!(await isTitleConstraintOk(values.title, customerDto?.customerId!, props.adCreator?.adId)).data) {
                        setAlreadyExistingTitles([...alreadyExistingTitles, values.title]);
                        formikHelpers.setFieldError("title", TITLE_ALREADY_EXISTS)
                        return;
                    }

                    if (isUpdate && JSON.stringify(values) == JSON.stringify(initialValues)) {
                        console.log("NOTHING UPDATED!");
                        props.onClose();
                        return;
                    }

                    // Add customerId and adId
                    (values as any)["customerId"] = customerDto?.customerId;
                    if (isUpdate) (values as any)["adId"] = props.adCreator?.adId;

                    /**
                     * If their is one image or more that is new in the frontend, the code will save these images in the backend
                     * and use the list of fileNames returned by the backend to replace the old FrontendImage with the string of fileName.
                    */
                    if (values.images.find((img) => img instanceof FrontendImage) != undefined) {
                        // Saving images file
                        let formData = new FormData();
                        values.images.forEach(img => {
                            if (img instanceof FrontendImage) {
                                formData.append("images", img.file);
                            }
                        });

                        // reverse like that the first will be the last when we will do .pop()
                        let savedImages = (await saveImages(formData)).data.reverse();

                        // reset the images to a list of string.
                        (values as any).images = values.images.map(img => {
                            if (img instanceof FrontendImage) return savedImages.pop();
                            else return img;
                        });
                        console.log(values.images);
                    }

                    if (isUpdate) {
                        await updateAd(values as any).then(
                            res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    props.onClose(true);
                                }
                            }
                        );
                    }

                    else {
                        await createAd(values as any).then(
                            res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    props.onClose(true);
                                }
                            }
                        );
                    }
                }}
            >
                {({ isValid, submitCount, isSubmitting }) => (

                    <>
                        <DialogTitle variant="h5" sx={{ fontWeight: "bold" }}>{isUpdate ? "Update" : "Create"} Ad</DialogTitle>
                        <Divider />

                        <DialogContent>
                            <Form id="create-ad">
                                <Stack spacing={3}>
                                    <Field name="title" component={AdCreationInput} label="Title" />
                                    <Field name="price" type="number" component={AdCreationInput} label="Price" />
                                    <Field name="description" component={AdCreationInput} label="Description" isTextArea />
                                    <Field name="address" component={AdCreationInput} label="Address" icon={<LocationOnIcon />} />

                                    {isUpdate ? <Field name="sold" component={AdCheckbox} type="checkbox" label="Is your ad sold?" /> : <></>}

                                    <Field name="visibility" component={AdVisibilitySelect} />
                                    <Field name="shape" component={AdShapeSelect} />

                                    <AdImages name="images" />

                                    <Field name="adTypeId" component={AdTypeSelect} />

                                    <AdTags name="tags" />
                                </Stack>
                            </Form >
                        </DialogContent>
                        <Divider />

                        <DialogActions>
                            <Button variant="text" onClick={() => props.onClose()}>Cancel</Button>
                            <Button disabled={(!isValid && (submitCount >= 1)) || isSubmitting} type="submit" form="create-ad">{isUpdate ? "Update" : "Create"}</Button>
                        </DialogActions>
                    </>
                )}
            </Formik>
        </Dialog>
    );
}