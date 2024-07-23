import { MenuItem } from "@mui/material";
import { createRandomKey } from "@services/RandomKeys";
import { AxiosError } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { AdType } from "../../model/dto/AdType";
import { getAllAdTypes } from "../../services/AdService";
import { SelectorReader } from "./SharedAdPart";
import { FieldProps } from "formik";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export interface AdTypeSelectProps extends FieldProps {
    isSearch?: boolean;
    options?: Array<String>;
    children?: ReactNode;
}

/**
 * @author Olivier mansuy
 * @modifiedBy Achraf
 */
export default function AdTypeSelect(props: AdTypeSelectProps) {
    const [adTypeArray, setAdTypeArray] = useState<AdType[]>();

    useEffect(() => {
        getAllAdTypes()
            .then((rep) => {
                if (rep?.data) {
                    if (props.isSearch) {
                        setAdTypeArray([{ idAdType: "ALL" as any, name: "ALL" }, ...rep?.data]);
                    }

                    else setAdTypeArray(rep?.data);
                }
            }).catch((error: AxiosError) => {
                console.log("ERORR : " + error);
                setAdTypeArray([{ idAdType: 1, name: "No tags found..." }]);
            });
    }, [])

    return (
        // To remove a warning from MUI with the MenuItem
        adTypeArray ?
            (
                <SelectorReader
                    {...props}
                    icon={<FormatListBulletedIcon />}
                    title="Category"
                >
                    {
                        adTypeArray.map((option) => (
                            <MenuItem key={createRandomKey()} value={option.idAdType}>{option.name}</MenuItem>
                        )) ??
                        // The ?? is their to remove a warning from MUI.
                        (<MenuItem></MenuItem>)
                    }
                </SelectorReader>
            ) : (
                <></>
            )
    );
}