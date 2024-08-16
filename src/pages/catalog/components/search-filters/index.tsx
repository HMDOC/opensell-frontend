import { AdTags } from "@components/shared/ad/tags";
import AdCategorySelect, { ALL_ID } from "@components/shared/AdCategorySelect";
import AdFilterSoldSelect from "@components/shared/AdFilterSoldSelect";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdSortDirSelect from "@components/shared/AdSortDirSelect";
import AdSortTypeSelect from "@components/shared/AdSortTypeSelect";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { Card, Pagination, Stack } from "@mui/material";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { priceWithMinAndMax } from "@utils/yupSchema";
import { Field, Form, FormikContext, useFormik } from "formik";
import { ReactElement, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { object, ref, string } from "yup";
import CatalogSearchBar from "../search-bar";

function cleanValuesForBackend(params: any, isBackend?: boolean): any {
    let values: any = {};

    Object.keys(params).forEach(key => {
        let value = params[key];
        if (value) values[key] = value;
    });

    if (isBackend) {
        // Clean object to update in the URL
        values.shape = params.shape > 0 ? params.shape - 1 : null;
        values.typeId = params.typeId == ALL_ID ? null : params.typeId;
    }

    return values;
}

function getSearchParamsValues(searchParams: URLSearchParams) {
    return {
        query: searchParams.get("query") ?? "",
        priceMin: searchParams.get("priceMin") ?? undefined,
        priceMax: searchParams.get("priceMax") ?? undefined,
        tags: searchParams.getAll("tags") ?? [],
        typeId: searchParams.get("typeId") ?? ALL_ID,
        shape: Number(searchParams.get("shape")) ?? 0,
        filterSold: searchParams.get("filterSold") ?? false,
        sortBy: searchParams.get("sortBy") ?? "addedDate",
        reverseSort: searchParams.get("reverseSort") ?? 0,
        page: searchParams.get("page") ?? 1
    }
};

type SearchFiltersProps = {
    searchMethod: any;
    pageCount : number;
};

/** 
    The component that holds all of the filter options.
    @author Davide
*/
export default function SearchFilters(props: SearchFiltersProps): ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();

    const [pageNb, setPageNb] = useState<number>( () => {
            let pageUrl =searchParams.get("page");
            return (pageUrl) ? Number.parseInt(pageUrl) : 1;
        }
    );

    const formik = useFormik({
        initialValues: getSearchParamsValues(searchParams),
        onSubmit(values) {
            setSearchParams(cleanValuesForBackend(values))
        },
        validationSchema:
            object({
                priceMin: priceWithMinAndMax(MAX_PRICE, 0, "PriceMin"),
                priceMax: priceWithMinAndMax(MAX_PRICE, 0, "PriceMax").moreThan(ref("priceMin"), "Price max cannot be less than or equal than price min."),
                typeId: string(),
            })
    });

    useEffect(() => {
        const tmp: any = getSearchParamsValues(searchParams);
        props.searchMethod(cleanValuesForBackend(tmp, true));
    }, [searchParams]);

    return (
        <Card component={Stack} width="280px" padding={2} spacing={3}>
            <FormikContext.Provider value={formik}>
                <Stack component={Form} id="searchFilters" spacing={2.25}>
                    <Stack alignItems="center">
                        <Field name="query" component={CatalogSearchBar} />
                    </Stack>

                    <Field name="priceMin" component={AdCreationInput} label="Price Min" type="number" />
                    <Field name="priceMax" component={AdCreationInput} label="Price Max" type="number" />
                    <Field name="shape" component={AdShapeSelect} label="Shape" isSearch />
                    <Field name="typeId" component={AdCategorySelect} isSearch label="Category" />
                    <AdTags name="tags" isSearch />
                    <Field name="sortBy" component={AdSortTypeSelect} label="Sort By" />
                    <Field name="reverseSort" component={AdSortDirSelect} label="Reverse Sort" />
                    <Field name="filterSold" component={AdFilterSoldSelect} label="Filter sold" />
                    <Pagination count={props.pageCount} page={pageNb} siblingCount={0} boundaryCount={1} color="primary" 
                        onChange={(_event : any, value : number) =>{
                            setPageNb(value)
                            searchParams.set("page", `${value}`)
                            setSearchParams(searchParams)
                        }}/>
                </Stack>
            </FormikContext.Provider>
        </Card>
    );
}