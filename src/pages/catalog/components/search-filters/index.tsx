import { AdTags } from "@components/shared/ad/tags";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdSortTypeSelect from "@components/shared/AdSortTypeSelect";
import AdTypeSelect from "@components/shared/AdTypeSelect";
import AdFilterSoldSelect from "@components/shared/AdFilterSoldSelect";
import FormikDatePicker from "@components/shared/formik/date-picker";
import CatalogSearchBar from "../search-bar";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { Card, Stack } from "@mui/material";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { priceWithMinAndMax } from "@utils/yupSchema";
import { Field, Form, Formik } from "formik";
import { ReactElement, RefObject, useEffect, useState } from "react";
import { date, object, string } from "yup";
import AdSortDirSelect from "@components/shared/AdSortDirSelect";
import { useSearchParams} from "react-router-dom";
import dayjs from "dayjs";

type SearchFiltersProps = {
    reference: RefObject<HTMLInputElement>;
    searchMethod : any;
};

// const adSortBy = [
//     { sortParam: "", sortVisual: "Added Date" },
//     { sortParam: "title", sortVisual: "Title" },
//     { sortParam: "price", sortVisual: "Price" }
// ];

/** 
    The component that holds all of the filter options.
    @author Davide
*/
export default function SearchFilters(props: SearchFiltersProps): ReactElement {
    const dateMin = "2020-01-01";
    const dateMax = "3000-01-01";

    const defaultFilters : any = {
        query: "",
        priceMin: "",
        priceMax: "",
        dateMin: null,
        dateMax: null,
        tags: [],
        typeId: "",
        shapeId: undefined,
        filterSold: null,
        sortBy: "addedDate",
        reverseSort: 0,
    }

    const [sParams, setsParams] = useSearchParams();

    let filterOpt : any = {
        query: sParams.get("query"),
        priceMin: sParams.get("priceMin"),
        priceMax: sParams.get("priceMax"),
        dateMin: sParams.get("dateMin") ? dayjs(sParams.get("dateMin")) : null,
        dateMax: sParams.get("dateMax") ? dayjs(sParams.get("dateMax")) : null,
        tags: sParams.getAll("tags"),
        typeId: sParams.get("typeId"),
        shapeId: sParams.get("shapeId"),
        filterSold: sParams.get("filterSold"),
        sortBy: sParams.get("sortBy"),
        reverseSort: sParams.get("reverseSort")
    }

    for( let key in filterOpt){
        if (filterOpt[key]===null){
            filterOpt[key] = defaultFilters[key]
        }
    }

const [filterOptions, setFilterOptions] = useState<any>(filterOpt);

    const updateURL = (params:any) => {
        let tmpFilterOptions : any = { query: ""};

        for (let key in params){
            let value = params[key];

            if (value != defaultFilters[key]){
                let val : any = value
                if (typeof defaultFilters[key] === "number"){
                    val = parseInt(value)
                    if (Number.isNaN(val)){
                        continue;
                    }
                }
                if (key.includes("date")){
                    if (value===null){
                        continue
                    }else{
                        val = dayjs(value)
                    }
                }

                tmpFilterOptions[key] = val;
            }
        }

        setsParams(tmpFilterOptions);
    }

    useEffect( () => {
        if (props.reference.current){
            props.reference.current.value = filterOptions.query
        }

        props.searchMethod(filterOptions);
    }, [])

    return (
        <Card component={Stack} width="280px" padding={2} spacing={3}>
            <Formik
                enableReinitialize={true}
                initialValues={filterOptions}
                validationSchema={
                    object({
                        // query: notEmptyWithMaxAndMin(80, 3, "query"),
                        priceMin: priceWithMinAndMax(MAX_PRICE, 0, "PriceMin"),
                        priceMax: priceWithMinAndMax(MAX_PRICE, 0, "PriceMax"),
                        dateMin: date().min(dateMin).nullable(),
                        dateMax: date().max(dateMax).nullable(),
                        typeId: string(),
                        //sortBy: string()
                        //reverseSort: boolean()
                    })

                }
                onSubmit={(values) => {
                    var params = structuredClone(values)
                    
                    if (values?.dateMin) {
                        let pDateMin = new Date((values?.dateMin as any)?.toString())
                        params.dateMin = pDateMin?.toISOString()
                    }
                    if (values?.dateMax) {
                        let pDateMax = new Date((values?.dateMax as any)?.toString())
                        params.dateMax = pDateMax?.toISOString()
                    }

                    if (props.reference.current)
                        params.query = props.reference.current.value;

                    console.log(params)

                    props.searchMethod(params)

                    updateURL(params)
                }}
            >
                <Stack component={Form} id="searchFilters" spacing={2.25}>
                    <Stack alignItems="center">
                        <CatalogSearchBar {...props} />
                    </Stack>

                    <Field name="priceMin" component={AdCreationInput} label="Price Min" type="number" />
                    <Field name="priceMax" component={AdCreationInput} label="Price Max" type="number" />
                    <Field name="dateMin" component={FormikDatePicker} label="Date Min" />
                    <Field name="dateMax" component={FormikDatePicker} label="Date Max" />
                    <Field name="shapeId" component={AdShapeSelect} label="Shape" isSearch />
                    <Field name="typeId" component={AdTypeSelect} isSearch label="Category" />
                    <AdTags name="tags" isSearch/>
                    <Field name="sortBy" component={AdSortTypeSelect} label="Sort By" />
                    <Field name="reverseSort" component={AdSortDirSelect} label="Reverse Sort" />
                    <Field name="filterSold" component={AdFilterSoldSelect} label="Filter sold" />
                </Stack>
            </Formik>
        </Card>
    );
}