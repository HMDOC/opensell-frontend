import { MenuItem } from "@mui/material";
import { createRandomKey } from "@utils/RandomKeys";
import { AxiosError } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { AdCategory } from "../../model/dto/AdCategory";
import { getAllAdCategorys } from "../../services/ad";
import { SelectorReader } from "./SharedAdPart";
import { FieldProps } from "formik";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const ALL_ID = "ALL";

export interface AdCategorySelectProps extends FieldProps {
    isSearch?: boolean;
    options?: Array<string>;
    children?: ReactNode;
}

/**
 * @author Olivier mansuy
 * @modifiedBy Achraf
 */
export default function AdCategorySelect(props: AdCategorySelectProps) {
    const [adCategoryArray, setAdCategoryArray] = useState<AdCategory[]>();

    useEffect(() => {
        getAllAdCategorys()
            .then((rep) => {
                if (rep?.data) {
                    if (props.isSearch) {
                        setAdCategoryArray([{ id: ALL_ID as any, name: "ALL" }, ...rep?.data]);
                    }

                    else setAdCategoryArray(rep?.data);
                }
            }).catch((error: AxiosError) => {
                console.log("ERORR : " + error);
                setAdCategoryArray([{ id: "1", name: "No tags found..." }]);
            });
    }, [])

    return (
        // To remove a warning from MUI with the MenuItem
        adCategoryArray ?
            (
                <SelectorReader
                    {...props}
                    icon={<FormatListBulletedIcon />}
                    title="Category"
                >
                    {
                        adCategoryArray.map((option) => (
                            <MenuItem key={createRandomKey()} value={option.id}>{option.name}</MenuItem>
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