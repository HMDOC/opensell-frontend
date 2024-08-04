import { AdTags } from "@components/shared/ad/tags";
import AdFilterSoldSelect from "@components/shared/AdFilterSoldSelect";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdSortDirSelect from "@components/shared/AdSortDirSelect";
import AdSortTypeSelect from "@components/shared/AdSortTypeSelect";
import AdTypeSelect from "@components/shared/AdTypeSelect";
import FormikDatePicker from "@components/shared/formik/date-picker";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { Card, Stack } from "@mui/material";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { priceWithMinAndMax } from "@utils/yupSchema";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";
import { date, object, ref, string } from "yup";
import CatalogSearchBar from "../search-bar";

type SearchFiltersProps = {
    searchMethod: any;
};

const dateMin = "2020-01-01";
const dateMax = "3000-01-01";

/** 
    The component that holds all of the filter options.
    @author Davide
*/
export default function SearchFilters(props: SearchFiltersProps): ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateUrl = (params: any) => {
        let tmp: any = {};

        Object.keys(params).forEach(key => {
            let value = params[key];
            if(value) tmp[key] = value;
        });

        setSearchParams(tmp);
    }

    return (
        <Card component={Stack} width="280px" padding={2} spacing={3}>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    query: searchParams.get("query") ?? "",
                    priceMin: searchParams.get("priceMin") ?? "",
                    priceMax: searchParams.get("priceMax") ?? "",
                    dateMin: searchParams.get("dateMin") ? dayjs(searchParams.get("dateMin")) : null,
                    dateMax: searchParams.get("dateMax") ? dayjs(searchParams.get("dateMax")) : null,
                    tags: searchParams.getAll("tags") ?? [],
                    typeId: searchParams.get("typeId") ?? "",
                    shapeId: Number(searchParams.get("shapeId")) ?? 0,
                    filterSold: searchParams.get("filterSold") ?? null,
                    sortBy: searchParams.get("sortBy") ?? "addedDate",
                    reverseSort: searchParams.get("reverseSort") ?? 0
                }}
                validationSchema={
                    object({
                        priceMin: priceWithMinAndMax(MAX_PRICE, 0, "PriceMin"),
                        priceMax: priceWithMinAndMax(MAX_PRICE, 0, "PriceMax").moreThan(ref("priceMin"), "Price max cannot be less than or equal than price min."),
                        dateMin: date().min(dateMin).nullable(),
                        dateMax: date().min(ref("dateMin"), "Date max cannot be less than date min.").max(dateMax).nullable(),
                        typeId: string(),
                    })
                }
                onSubmit={(values) => {
                    var params = structuredClone(values)

                    if (values?.dateMin) {
                        (params as any).dateMin = values?.dateMin.toDate()?.toISOString();
                    }
                    if (values?.dateMax) {
                        (params as any).dateMax = values?.dateMax.toDate()?.toISOString();
                    }

                    (params as any).shapeId = params.shapeId > 0 ? params.shapeId - 1 : null;

                    console.log(params);
                    props.searchMethod(params);

                    updateUrl(params);
                }}
            >
                <Stack component={Form} id="searchFilters" spacing={2.25}>
                    <Stack alignItems="center">
                        <Field name="query" component={CatalogSearchBar} />
                    </Stack>

                    <Field name="priceMin" component={AdCreationInput} label="Price Min" type="number" />
                    <Field name="priceMax" component={AdCreationInput} label="Price Max" type="number" />
                    <Field name="dateMin" component={FormikDatePicker} label="Date Min" />
                    <Field name="dateMax" component={FormikDatePicker} label="Date Max" />
                    <Field name="shapeId" component={AdShapeSelect} label="Shape" isSearch />
                    <Field name="typeId" component={AdTypeSelect} isSearch label="Category" />
                    <AdTags name="tags" isSearch />
                    <Field name="sortBy" component={AdSortTypeSelect} label="Sort By" />
                    <Field name="reverseSort" component={AdSortDirSelect} label="Reverse Sort" />
                    <Field name="filterSold" component={AdFilterSoldSelect} label="Filter sold" />
                </Stack>
            </Formik>
        </Card>
    );
}