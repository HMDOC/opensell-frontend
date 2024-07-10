import { AdImages } from "@components/ad-images";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import { AdTags } from "@components/shared/AdTags";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { useAppContext } from "@context/AppContext";
import { AdImage } from "@entities/dto/AdBuyerView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import { FrontendImage, ImageBox } from "@entities/dto/v2/ImageBox";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { createOrUpdateAd } from "@services/AdCreationService";
import { isTitleConstraintOk } from "@services/AdService";
import AdTypeSelect from "@shared/AdTypeSelect";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@utils/yupSchema";
import { HttpStatusCode } from "axios";
import { Field, Form, Formik } from "formik";
import { array, object, string } from "yup";
import { AdCheckbox } from "./components/ad-checkbox";
import { AdCreationInput } from "./components/ad-creation-input";

interface AdCreationModalProps {
    open: boolean;
    onClose(isChange?: boolean): void;
    adCreator?: AdCreator;
}

export default function AdCreationModal(props: AdCreationModalProps) {
    const { customerDto } = useAppContext();
    const isUpdate: boolean = props.adCreator != undefined;

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
        <Formik
            initialValues={initialValues}
            validationSchema={
                object({
                    title: notEmptyWithMaxAndMin(80, 3, "Title").test(
                        "titleUniqueConstraint",
                        "You already have an ad with this title",
                        (value) => {
                            return new Promise((resolve) => {
                                // Need to reduce the amount of time it makes the query to the backend.
                                isTitleConstraintOk(value, customerDto?.customerId, props.adCreator?.adId).then(
                                    res => resolve(res?.data)
                                );
                            })
                        }
                    ),
                    price: priceWithMinAndMax(MAX_PRICE, 0, "Price"),
                    description: notEmptyWithMaxAndMin(5000, 10, "Description"),
                    address: notEmptyWithMaxAndMin(256, 4, "Address"),
                    adTypeId: string().required("Category is required."),
                    visibility: string().required("Visibility is required."),
                    shape: string().required("Shape is required."),
                    images: array().min(2, " should be at least 2."),
                })}
            onSubmit={async (values) => {
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
                }

                await createOrUpdateAd(formData).then(
                    res => {
                        if (res.status == HttpStatusCode.Ok) {
                            props.onClose(true);
                        }
                    }
                );
            }}
        >
            {({ isValid }) => (

                <Dialog
                    open={props.open}
                    onClose={() => props.onClose()}
                    maxWidth={false}
                    PaperProps={{ sx: { borderRadius: "10px" } }}
                >
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
                        <Button disabled={!isValid} type="submit" variant="contained" form="create-ad">{isUpdate ? "Update" : "Create"}</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Formik>
    );
}