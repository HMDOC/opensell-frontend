import { faList } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@mui/material";
import { createRandomKey } from "@services/RandomKeys";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AdType } from "../../entities/dto/AdType";
import { getAllAdTypes } from "../../services/AdService";
import { SelectorReader, SelectorReaderProps } from "./SharedAdPart";

export interface AdTypeSelectProps extends SelectorReaderProps {
    isSearch?: boolean;
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
                        setAdTypeArray([{ idAdType: "" as any, name: "All" }, ...rep?.data]);
                    }

                    else setAdTypeArray(rep?.data);
                }
            }).catch((error: AxiosError) => {
                console.log("ERORR : " + error);
                setAdTypeArray([{ idAdType: 1, name: "No tags found..." }]);
            });
    }, [])

    return (
        <SelectorReader
            {...props}
            iconProp={faList}
            title="Category"
        >
            {
                adTypeArray?.map((option) => (
                    <MenuItem key={createRandomKey()} value={option.idAdType}>{option.name}</MenuItem>
                )) ??
                // The ?? is their to remove a warning from MUI.
                (<MenuItem></MenuItem>)
            }
        </SelectorReader>
    );
}