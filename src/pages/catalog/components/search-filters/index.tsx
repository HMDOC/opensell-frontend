import { AdTags } from "@components/shared/ad/tags";
import AdShapeSelect from "@components/shared/AdShapeSelect";
import AdSortTypeSelect from "@components/shared/AdSortTypeSelect";
import AdTypeSelect from "@components/shared/AdTypeSelect";
import FormikDatePicker from "@components/shared/formik/date-picker";
import { MAX_PRICE } from "@components/shared/SharedAdPart";
import { Stack } from "@mui/material";
import { AdCheckbox } from "@pages/ad-creation/components/ad-checkbox";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { priceWithMinAndMax } from "@utils/yupSchema";
import { Field, Form, Formik } from "formik";
import { ReactElement, useState } from "react";
import { boolean, object, string } from "yup";

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
const SearchFilters = (props): ReactElement => {
    //const filtersUpdated = (event) => props.filterUpdate(event);

    // Tag error and emplacement container
    const [searchOrder, setSearchOrder] = useState<number>(props.defValue);

    return (<>
        <Formik
            initialValues={{
                query: "",
                priceMin: 0,
                priceMax: MAX_PRICE,
                dateMin: null,
                dateMax: null,
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
                    reverseSort: boolean()
                })

            }
            onSubmit={(values) => {
                console.log(values);
                // You need to cast the dateMin and max, because MUI use a special type of date.
                console.log(new Date(values.dateMin?.toString())?.toLocaleDateString()); // 7/13/2024
                console.log("Hello World!");
            }}
        >
            <Stack component={Form} id="searchFilters" spacing={1}>
                <Field name="priceMin" component={AdCreationInput} label="Price Min" type="number" />
                <Field name="priceMax" component={AdCreationInput} label="Price Max" type="number" />
                <Field name="dateMin" component={FormikDatePicker} label="Date Min" />
                <Field name="dateMax" component={FormikDatePicker} label="Date Max" />
                <Field name="shapeId" component={AdShapeSelect} />
                <Field name="adTypeId" component={AdTypeSelect} isSearch label="Category" />
                <AdTags name="tags" />
                <Field name="sortBy" component={AdSortTypeSelect} label="Sort By" />
                <Field ref={props.reverseSort} name="reverseSort" component={AdCheckbox} type="checkbox" label="Reverse Sort" />
                <Field name="filterSold" component={AdCheckbox} type="checkbox" label="Filter sold" />

                <div ref={props.filterElementRef}></div>
            </Stack>
        </Formik>
    </>);

    // Old
    let old = () => {
        // <div id="filterContainer" ref={props.filterElementRef} onChange={filtersUpdated}>
        //     <IconLabelError iconProp={faSackDollar} title="Price" isTitle />
        //     <input type="number" name="priceMin" id="priceMin"
        //         className="smallInput" min={0} max={MAX_PRICE}
        //         defaultValue={0} placeholder={`${0}$`} step={25} />
        //     <span className="smallInputLabel">
        //         to
        //     </span>
        //     <input type="number" name="priceMax" id="priceMax"
        //         className="smallInput" min={0} max={MAX_PRICE}
        //         defaultValue={MAX_PRICE}
        //         placeholder={`${MAX_PRICE}$`} step={25} />
        //     <IconLabelError iconProp={faClock} title="Date" isTitle />
        //     <input type="date" name="dateMin" id="dateMin"
        //         min={dateMin} max={dateMax} defaultValue={null} />
        //     <input type="date" name="dateMax" id="dateMax"
        //         min={dateMin} max={dateMax} defaultValue={null} />

        //     {/* Cannot work without Formik! */}
        //     {/* <AdTypeSelect  /> */}

        //     <IconLabelError iconProp={faSort} title="Sorting" isTitle />
        //     <select name="sortBy" id="sortBy" className="selector-reader">
        //         {adSortBy.map((value, key) => {
        //             return (<option value={value?.sortParam} key={key}> {value?.sortVisual} </option>)
        //         })}
        //     </select>

        //     <input ref={props.reverseSort} type="checkbox" name="reverseSort" id="reverseSort"
        //         defaultValue={""} onChange={(e) => {
        //             setSearchOrder((searchOrder === 0) ? 1 : 0)
        //         }} />

        //     <div>
        //         {/* Cannot work without Formik! */}
        //         {/* <AdTags 
        //     name="tags"
        //     isSearch
        //     placeholder="list all tags" /> */}
        //     </div>

        //     <IconLabelError iconProp={faShapes} title="Shape" isTitle />
        //     <select name="shapeId" id="shapeId" className="selector-reader">
        //         <option value=""> All </option>
        //         {SHAPE_ARRAY.map((value, key) => {
        //             return (<option value={key} key={key}> {value} </option>)
        //         })}
        //     </select>

        //     <IconLabelError iconProp={faReceipt} title="Sold" isTitle />
        //     <select name="filterSold" id="filterSold" className="selector-reader">
        //         <option value=""> All </option>
        //         <option value={0}> Only On Sale </option>
        //         <option value={1}> Only Sold </option>
        //     </select>
        // </div>
    }

}

export default SearchFilters;