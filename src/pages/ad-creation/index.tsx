import { AdImages } from "@components/ad-images";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import { AdTags } from "@components/shared/AdTags";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { FrontendImage, ImageBox } from "@entities/dto/v2/ImageBox";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@utils/yupSchema";
import { v2CreateAd } from "@services/AdCreationService";
import AdTypeSelect from "@shared/AdTypeSelect";
import { HttpStatusCode } from "axios";
import { Field, Form, Formik } from "formik";
import { array, object, string } from "yup";
import { AdCreationInput } from "./components/ad-creation-input";
import { AdImage } from "@entities/dto/AdBuyerView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { useAppContext } from "@context/AppContext";

interface AdCreationModalProps {
    open: boolean;
    onClose(): void;
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
        images: isUpdate ? (JSON.parse(props.adCreator?.adImagesJson) as AdImage[]).map<ImageBox>((img: AdImage) => ({ id: img.idAdImage, content: img.path })) : new Array<ImageBox>(),
        isSold: props.adCreator?.isSold ?? false
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth={false}
            PaperProps={{ sx: { borderRadius: "10px" } }}
        >
            <DialogTitle variant="h5" sx={{ fontWeight: "bold" }}>{isUpdate ? "Update" :  "Create"} Ad</DialogTitle>
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
                    onSubmit={async (values) => {
                        let formData = new FormData();
                        formData.append("customerId", `${customerDto.customerId}`);

                        for (let key in values) {
                            if (key != "images") formData.append(key, values[key]);
                        }

                        // Handling images is different between modif and creation
                        if (isUpdate) {
                            let adImages: AdImage[] = [];
                            let imagePositions: number[] = [];

                            values.images.forEach((img: ImageBox, index) => {
                                if (img.content instanceof FrontendImage) {
                                    formData.append("images", img.content.file);
                                    imagePositions.push(index);
                                } else {
                                    adImages.push({ idAdImage: img.id, path: img.content, spot: index, isLocal: true })
                                }
                            });

                            formData.append("adImagesJson", JSON.stringify(adImages));
                        }

                        else {
                            values.images.forEach((img: ImageBox) => formData.append("images", img.content as any));
                        }

                        await v2CreateAd(formData).then(
                            res => {
                                if (res.status == HttpStatusCode.Ok) {
                                    props.onClose();
                                }
                            }
                        );
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
                <Button variant="text" onClick={props.onClose}>Cancel</Button>
                <Button type="submit" variant="contained" form="create-ad">{isUpdate ? "Update" :  "Create"}</Button>
            </DialogActions>
        </Dialog>
    );
}