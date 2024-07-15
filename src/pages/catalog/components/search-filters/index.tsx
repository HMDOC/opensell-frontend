import { faClock, faEarthAmerica, faReceipt, faSackDollar, faShapes, faSort } from "@fortawesome/free-solid-svg-icons";
import { ReactElement, useState } from "react";
import AdShapeSelect, { SHAPE_ARRAY } from "@components/shared/AdShapeSelect";
import IconLabelError from "@components/shared/IconLabelError";
import { MAX_PRICE, SelectorReader } from "@components/shared/SharedAdPart";
import AdTypeSelect from "@components/shared/AdTypeSelect";
import { Formik, Form, Field } from "formik";
import { Stack } from "@mui/material";
import { boolean, date, object, string } from "yup";
import { notEmptyWithMaxAndMin, priceWithMinAndMax } from "@utils/yupSchema";
import { AdCreationInput } from "@pages/ad-creation/components/ad-creation-input";
import { AdTags } from "@components/shared/ad/tags";
import AdVisibilitySelect from "@components/shared/AdVisibilitySelect";
import { sortBy } from "lodash";
import AdSortTypeSelect from "@components/shared/AdSortTypeSelect";
import { AdCheckbox } from "@pages/ad-creation/components/ad-checkbox";

/** 
    The component that holds all of the filter options.
    @author Davide
*/
const SearchFilters = (props) : ReactElement =>{
    const filtersUpdated = (event) => props.filterUpdate(event);

    const initialValues = {
        query: "",
        priceMin: 0,
        priceMax: MAX_PRICE,
        dateMin: null,
        dateMax: null,
        typeId: null,
        adTags: [],
        shapeId: null,
        filterSold: null,
        sortBy: "addedDate",
        reverseSort: false,
    };

    const dateMin = "2020-01-01";
    const dateMax = "3000-01-01";

    const adSortBy = [
        {sortParam : "", sortVisual : "Added Date"},
        {sortParam : "title", sortVisual : "Title"},
        {sortParam : "price", sortVisual : "Price"}
    ];

    // Tag error and emplacement container
    const [searchOrder, setSearchOrder] = useState<number>(props.defValue);

    return ( <>
            <Formik 
                initialValues={initialValues}
                validationSchema={
                    object({
                        query: notEmptyWithMaxAndMin(80, 3, "query"),
                        priceMin: priceWithMinAndMax(MAX_PRICE, 0, "PriceMin"),
                        priceMax: priceWithMinAndMax(MAX_PRICE, 0, "PriceMax"),
                        dateMin: date().min("2020-01-01"), 
                        dateMax: date().max("3000-01-01"),
                        typeId: string(),
                        sortBy: string(),
                        reverseSort: boolean()
                    })
                    
                }
                onSubmit={async (values) => {

                }}    
            >
                <>
                    <Form id="searchFilters">
                        <Stack spacing={1}>
                            <Field name="priceMin" component={AdCreationInput} label="Price Min"></Field>
                            <Field name="priceMax" component={AdCreationInput} label="Price Max"></Field>
                            <Field name="dateMin" component={AdCreationInput} type="date" label="Date Min"></Field>
                            <Field name="dateMax" component={AdCreationInput} type="date" label="Date Max"></Field>
                            <Field name="shape" component={AdShapeSelect} />
                            <Field name="adTypeId" component={AdTypeSelect} label="Category" />
                            <AdTags name="tags" />
                            <Field name="sortBy" component={AdSortTypeSelect}></Field>

                            <Field ref={props.reverseSort} name="reverseSort" component={AdCheckbox} type="checkbox" label="Reverse Sort" />
                            <Field name="filterSold" component={AdCheckbox} type="checkbox" label="Filter sold" />
                        </Stack>
                    </Form>
                    <div ref={props.filterElementRef}></div>
                </>
            </Formik>
        </>);
    
    let old =(
        <>            
            <div id="filterContainer" ref={props.filterElementRef} onChange={filtersUpdated}>
                <IconLabelError iconProp={faSackDollar} title="Price" isTitle />
                <input type="number" name="priceMin" id="priceMin" 
                    className="smallInput" min={0} max={MAX_PRICE} 
                    defaultValue={0} placeholder={`${0}$`} step={25}/>
                <span className="smallInputLabel">
                    to
                </span>
                <input type="number" name="priceMax" id="priceMax" 
                    className="smallInput" min={0} max={MAX_PRICE} 
                    defaultValue={MAX_PRICE} 
                    placeholder={`${MAX_PRICE}$`} step={25}/>
                <IconLabelError iconProp={faClock} title="Date" isTitle />
                <input type="date" name="dateMin" id="dateMin"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                <input type="date" name="dateMax" id="dateMax"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                
                {/* Cannot work without Formik! */}
                {/* <AdTypeSelect  /> */}

                <IconLabelError iconProp={faSort} title="Sorting" isTitle />
                <select name="sortBy" id="sortBy" className="selector-reader">
                    {adSortBy.map( (value, key) => {
                        return (<option value={value?.sortParam} key={key}> { value?.sortVisual } </option>)
                    } )}
                </select>
                
                <input ref={props.reverseSort} type="checkbox" name="reverseSort" id="reverseSort" 
                    defaultValue={""} onChange={(e) =>{
                        setSearchOrder((searchOrder===0) ? 1 : 0)
                    }}/>

                <div>
                {/* Cannot work without Formik! */}
                {/* <AdTags 
                    name="tags"
                    isSearch
                    placeholder="list all tags" /> */}
                </div>
                
                <IconLabelError iconProp={faShapes} title="Shape" isTitle />
                <select name="shapeId" id="shapeId" className="selector-reader">
                    <option value=""> All </option>
                    {SHAPE_ARRAY.map( (value, key) => {
                        return (<option value={key} key={key}> { value } </option>)
                    } )}
                </select>

                <IconLabelError iconProp={faReceipt} title="Sold" isTitle />
                <select name="filterSold" id="filterSold" className="selector-reader">
                    <option value=""> All </option>
                    <option value={0}> Only On Sale </option>
                    <option value={1}> Only Sold </option>
                </select>
            </div>
            
        </>
    )
}

export default SearchFilters;