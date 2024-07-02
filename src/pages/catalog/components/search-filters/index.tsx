import { faClock, faReceipt, faSackDollar, faShapes, faSort } from "@fortawesome/free-solid-svg-icons";
import { ReactElement, useState } from "react";
import { SHAPE_ARRAY } from "@components/shared/AdShapeSelect";
import IconLabelError from "@components/shared/part/IconLabelError";
import { MAX_PRICE } from "@components/shared/SharedAdPart";

/** 
    The component that holds all of the filter options.
    @author Davide
*/
const SearchFilters = (props) : ReactElement =>{
    const filtersUpdated = (event) => props.filterUpdate(event);

    const dateMin = "2020-01-01";
    const dateMax = "3000-01-01";

    const adSortBy = [
        {sortParam : "", sortVisual : "Added Date"},
        {sortParam : "title", sortVisual : "Title"},
        {sortParam : "price", sortVisual : "Price"}
    ];

    // Tag error and emplacement container
    const [searchTagsError, setSearchTagsError] = useState("NONE");
    const [searchOrder, setSearchOrder] = useState<number>(props.defValue);

    // {adTypes.forEach( (value, key) => {} )}
    return (
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
                {/* <AdTypeSelect /> */}

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
                    addTag={(tag) => props.setSearchTags([...props.searchTags, tag])}
                    deleteTag={(tag) => props.setSearchTags(props.searchTags.filter(adTags => adTags !== tag))}
                    isSearch
                    tags={props.searchTags}
                    error={searchTagsError}
                    setError={setSearchTagsError} 
                    placeholder={"list all tags"} /> */}
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