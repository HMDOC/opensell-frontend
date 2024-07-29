import { AdTags } from "@components/shared/ad/tags";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdSortTypeSelect from "@components/shared/AdSortTypeSelect";
import AdTypeSelect from "@components/shared/AdTypeSelect";
import FormikDatePicker from "@components/shared/formik/date-picker";
import HomeSearchBar from "@components/shared/home-search-bar";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { Card, Stack } from "@mui/material";
import { AdCheckbox } from "@pages/ad-creation/components/ad-checkbox";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { priceWithMinAndMax } from "@utils/yupSchema";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import { ReactElement, RefObject } from "react";
import { boolean, object, string } from "yup";

type SearchFiltersProps = {
    defSortValue: boolean;
    filterUpdate: object;
    reference: RefObject<HTMLInputElement>;
    click: any;
};

const dateMin = "2020-01-01";
const dateMax = "3000-01-01";

const adSortBy = [
    { sortParam: "", sortVisual: "Added Date" },
    { sortParam: "title", sortVisual: "Title" },
    { sortParam: "price", sortVisual: "Price" }
];

/** 
    The component that holds all of the filter options.
    @author Davide
*/
export default function SearchFilters(props: SearchFiltersProps): ReactElement {
    //const filtersUpdated = (event) => props.filterUpdate(event);

    const searchBarPress = (event: any) => {
        let key: string = event.key;
        if (key === "Enter") {
            console.log("Enter")
            props.click(event.timeStamp);
        }
    }

    return (
        <Card component={Stack} width="350px" padding={2} spacing={3}>
            <Formik
                initialValues={{
                    query: "",
                    priceMin: 0,
                    priceMax: MAX_PRICE,
                    dateMin: dayjs(dateMin),
                    dateMax: dayjs(dateMax),
                    typeId: "",
                    adTags: [],
                    atTypeId: "ALL",
                    shapeId: "",
                    filterSold: false,
                    sortBy: 0,
                    reverseSort: false,
                }}
                validationSchema={
                    object({
                        // query: notEmptyWithMaxAndMin(80, 3, "query"),
                        priceMin: priceWithMinAndMax(MAX_PRICE, 0, "PriceMin"),
                        priceMax: priceWithMinAndMax(MAX_PRICE, 0, "PriceMax"),
                        // dateMin: date().min("2020-01-01"),
                        // dateMax: date().max("3000-01-01"),
                        adTypeId: string(),
                        sortBy: string(),
                        reverseSort: boolean(),
                        filterSold: boolean()
                    })

                }
                onSubmit={(values) => {
                    console.log(values);
                    // You need to cast the dateMin and max, because MUI use a special type of date.
                    console.log(new Date((values.dateMin as any)?.toString())?.toLocaleDateString()); // 7/13/2024
                    console.log("Hello World!");
                }}
            >
                <Stack component={Form} id="searchFilters" spacing={2.25}>
                    <Stack alignItems="center">
                        <HomeSearchBar isSearch {...props} searchBarPress={searchBarPress} />
                    </Stack>

                    <Field name="priceMin" component={AdCreationInput} label="Price Min" type="number" />
                    <Field name="priceMax" component={AdCreationInput} label="Price Max" type="number" />
                    <Field name="dateMin" component={FormikDatePicker} label="Date Min" />
                    <Field name="dateMax" component={FormikDatePicker} label="Date Max" />
                    <Field name="shapeId" component={AdShapeSelect} />
                    <Field name="adTypeId" component={AdTypeSelect} isSearch label="Category" />
                    <AdTags name="tags" isSearch />
                    <Field name="sortBy" component={AdSortTypeSelect} label="Sort By" />
                    <Field name="reverseSort" component={AdCheckbox} type="checkbox" label="Reverse Sort" />
                    <Field name="filterSold" component={AdCheckbox} type="checkbox" label="Filter sold" />
                </Stack>
            </Formik>
        </Card>
    );
}