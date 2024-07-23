import { AdImages } from "@components/ad-images";
import { AdTags } from "@components/shared/ad/tags";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { useAppContext } from "@context/AppContext";
import { FrontendImage, ImageBox } from "../../model/dto/v2/ImageBox";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { createAd, updateAd } from "@services/ad/modification";
import { isTitleConstraintOk } from "@services/ad/modification";
import AdTypeSelect from "@shared/AdTypeSelect";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@utils/yupSchema";
import { HttpStatusCode } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import { array, object, string } from "yup";
import { AdCheckbox } from "./components/ad-checkbox";
import { AdCreationInput } from "./components/ad-creation-input";
import { useState } from "react";
import AdCreatorDto from "@services/ad/modification/dto/AdCreatorDto";
import AdImage from "@model/AdImage";

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
        images: isUpdate ? (JSON.parse(props.adCreator?.adImagesJson) as AdImage[]).map<ImageBox>((img: AdImage) => ({ id: img.id, content: img.path })) : new Array<ImageBox>(),
        isSold: props.adCreator?.isSold ?? false,
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
                onSubmit={async (values: any, formikHelpers: FormikHelpers<FormikValues>) => {
                    if (!(await isTitleConstraintOk(values.title, customerDto?.customerId, props.adCreator?.adId)).data) {
                        setAlreadyExistingTitles([...alreadyExistingTitles, values.title]);
                        formikHelpers.setFieldError("title", TITLE_ALREADY_EXISTS)
                        return;
                    }

                    if (isUpdate && JSON.stringify(values) == JSON.stringify(initialValues)) {
                        console.log("NOTHING UPDATED!");
                        props.onClose();
                        return;
                    }

                    let formData = new FormData();
                    formData.append("customerId", `${customerDto.customerId}`);

                    for (let key in values) {
                        if (!["images", "deletedImg"].includes(key)) formData.append(key, values[key]);
                    }

                    // For update
                    let adImages: AdImage[] = [];

                    values.images.forEach((img: ImageBox, index) => {
                        if (img.content instanceof FrontendImage) {
                            formData.append("images", img.content.file);
                            formData.append("imagePositions", index + "");
                        } else {
                            // Will not be called if it is a create.
                            adImages.push({ id: img.id, path: img.content, spot: index, isLocal: true })
                        }
                    });

                    if (isUpdate) {
                        formData.append("adImagesJson", JSON.stringify(adImages));
                        formData.append("adId", props.adCreator.adId + "");
                        
                        await updateAd(formData).then(
                            res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    props.onClose(true);
                                }
                            }
                        );
                    }

                    else {
                        await createAd(formData).then(
                            res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    props.onClose(true);
                                }
                            }
                        );
                    }
                }}
            >
                {({ isValid, submitCount }) => (

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

                                    {isUpdate ? <Field name="isSold" component={AdCheckbox} type="checkbox" label="Is your ad sold?" /> : <></>}

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
                            <Button disabled={!isValid && (submitCount >= 1)} type="submit" form="create-ad">{isUpdate ? "Update" : "Create"}</Button>
                        </DialogActions>
                    </>
                )}
            </Formik>
        </Dialog>
    );
}