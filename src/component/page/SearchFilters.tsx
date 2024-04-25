import {ReactElement, useState } from "react";
import "../../css/component/page/SearchBar.css";
import { MAX_PRICE, SHAPE_ARRAY } from "../shared/SharedAdPart";
import AdTypeSelect from "../shared/AdTypeSelect";
import { AdTags } from "../shared/AdTags";
import { HtmlCode } from "../../services/verification/HtmlCode";

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
    const [searchTagsError, setSearchTagsError] = useState<HtmlCode>(HtmlCode.SUCCESS);

    const [searchOrder, setSearchOrder] = useState<number>(props.defValue);

    // {adTypes.forEach( (value, key) => {} )}
    return (
        <>            
            <div id="filterContainer" ref={props.filterElementRef} onChange={filtersUpdated}>
                <h5>Price</h5>
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

                <h5>Date</h5>
                <input type="date" name="dateMin" id="dateMin"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                <input type="date" name="dateMax" id="dateMax"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                
                <h5>Category</h5>
                <AdTypeSelect inputId="typeId" inputName="typeId" defaultOptionText="All"/>

                <h5>Sorting</h5>
                <select name="sortBy" id="sortBy">
                    {adSortBy.map( (value, key) => {
                        return (<option value={value?.sortParam} key={key}> { value?.sortVisual } </option>)
                    } )}
                </select>
                
                <input ref={props.reverseSort} type="checkbox" name="reverseSort" id="reverseSort" 
                    defaultValue={""} value={searchOrder} onChange={(e) =>{
                        setSearchOrder((searchOrder===0) ? 1 : 0)
                    }}/>
                
                {/*<h5>Tags</h5>
                 <input type="text" name="tagListId" id="tagListId"
                    placeholder="list all tags (by id)" defaultValue={""} /> */}

                <div>
                    <AdTags 
                        addTag={(tag) => props.setSearchTags([...props.searchTags, tag])}
                        deleteTag={(tag) => props.setSearchTags(props.searchTags.filter(adTags => adTags != tag))}
                        isSearch
                        tags={props.searchTags}
                        error={searchTagsError}
                        setError={setSearchTagsError} 
                        placeholder={"list all tags"} />
                </div>
                
                <h5>Shape</h5>
                <select name="shapeId" id="shapeId">
                    <option value=""> All </option>
                    {SHAPE_ARRAY.map( (value, key) => {
                        return (<option value={key} key={key}> { value } </option>)
                    } )}
                </select>

                <h5>Sold</h5>
                <select name="filterSold" id="filterSold">
                    <option value=""> All </option>
                    <option value={0}> Only On Sale </option>
                    <option value={1}> Only Sold </option>
                </select>
            </div>
            
        </>
    )
}

export default SearchFilters;