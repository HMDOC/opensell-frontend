import { Button } from "@mui/material";
import { ErrorMessage, FieldArray, useFormikContext } from "formik";
import { ChangeEvent, useEffect } from "react";
import { createRandomKey } from "../../services/RandomKeys";
import "./style.scss";
import { FrontendImage, ImageBox } from "@entities/dto/v2/ImageBox";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconLabelError from "@components/shared/part/IconLabelError";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export function AdImages(props: { name: string }) {
    const { values, setFieldValue } = useFormikContext();
    const images: ImageBox[] = values[props.name];

    useEffect(() => {

        return (
            images?.forEach(revokeUrl)
        );
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let files = Array.from(e.target.files);
        let currentFiles: ImageBox[] = [];

        files.forEach(file =>
            currentFiles.push({ content: new FrontendImage(file, URL.createObjectURL(file)) })
        );

        setFieldValue(props.name, [...images, ...currentFiles])
        e.target.value = null;
    };

    const revokeUrl = (currentImg: ImageBox): void => {
        if (currentImg.content instanceof FrontendImage) {
            URL.revokeObjectURL(currentImg.content.blobUrl);
        }
    };

    const removeImageBox = (img: ImageBox, removeCallback: any) => {
        removeCallback(images?.indexOf(img));
        revokeUrl(img);
    };

    return (
        <FieldArray name={props.name}>
            {({ remove }) => (
                <>
                    <IconLabelError title="Images" iconProp={faImage} error={(<ErrorMessage name={props.name} /> as any) as string}></IconLabelError>

                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        upload

                        <input
                            onChange={(e) => handleChange(e)}
                            type="file"
                            multiple
                            accept="image/png"
                            hidden
                        />
                    </Button>

                    <div>
                        {images?.map((img: ImageBox) => (
                            <img onDoubleClick={() => removeImageBox(img, remove)} className="ad-image" key={createRandomKey()} src={img.content instanceof FrontendImage ? img.content.blobUrl : img.content} />
                        ))}
                    </div>
                </>
            )}
        </FieldArray>
    );
}