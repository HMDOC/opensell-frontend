import { IconLabel } from "@components/shared/IconLabel";
import { FrontendImage, ImageBox } from "@model/dto/v2/ImageBox";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { Button, Stack, Typography } from "@mui/material";
import getAdImageUrl from "@services/file";
import { createRandomKey } from "@utils/RandomKeys";
import { ErrorMessage, FieldArray, useFormikContext } from "formik";
import { ChangeEvent, useEffect } from "react";
import "./style.css";

export function AdImages(props: { name: string }) {
    const { values, setFieldValue } = useFormikContext<any>();
    const images: ImageBox[] = values[props.name];

    useEffect(() => {
        return (
            images?.forEach(revokeUrl)
        );
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let files = Array.from(e.target.files!);
        let currentFiles: ImageBox[] = [];

        files.forEach(file =>
            currentFiles.push(new FrontendImage(file, URL.createObjectURL(file)))
        );

        setFieldValue(props.name, [...images, ...currentFiles])
        e.target.value = "";
    };

    const revokeUrl = (currentImg: ImageBox): void => {
        URL.revokeObjectURL((currentImg as FrontendImage).blobUrl);
    };

    const removeImageBox = (img: ImageBox, removeCallback: any) => {
        removeCallback(images?.indexOf(img));

        if (img instanceof FrontendImage) {
            revokeUrl(img);
        }
    };

    return (
        <FieldArray name={props.name}>
            {({ remove }) => (
                <>
                    <Stack spacing={0.5}>
                        <IconLabel
                            title="Images"
                            icon={<ImageIcon />}
                        />
                        <Typography variant="body2" color={"error"}>
                            <ErrorMessage name={props.name} />
                        </Typography>
                    </Stack>

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
                            <img onDoubleClick={() => removeImageBox(img, remove)} className="ad-image" key={createRandomKey()} src={img instanceof FrontendImage ? img.blobUrl : getAdImageUrl(img)} />
                        ))}
                    </div>
                </>
            )}
        </FieldArray>
    );
}