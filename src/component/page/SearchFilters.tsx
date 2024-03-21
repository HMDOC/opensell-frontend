import {ReactElement, useEffect, useState } from "react";
import "../../css/component/page/SearchBar.css";
import { getAllAdTypes } from "../../services/AdService";

/** 
    The component that holds all of the filter options.
    @author Davide
*/
const SearchFilters = (props) : ReactElement =>{
    const filtersUpdated = (event) => props.filterUpdate(event);

    const priceMax = 99990;
    const dateMin = "2020-01-01";
    const dateMax = "3000-01-01";

    const [adTypes, setAdTypes] = useState<Array<any>>(new Array());
    const adSortBy = [
        {sortParam : "", sortVisual : "Added Date"},
        {sortParam : "title", sortVisual : "Title"},
        {sortParam : "price", sortVisual : "Price"}
    ]

    useEffect( () => {
        getAllAdTypes().then(res => {
            setAdTypes(res?.data);
        })
    }, [])

    // {adTypes.forEach( (value, key) => {} )}
    return (
        <div onChange={filtersUpdated} hidden>
            <h2>Filters</h2>
            
            <div id="fitlerContainer" ref={props.filterElementRef}>
                <input type="range" name="priceMin" id="priceMin"
                    min={0} max={priceMax} defaultValue={0} step={10}/>
                <input type="range" name="priceMax" id="priceMax" 
                    min={0} max={priceMax} defaultValue={priceMax} step={10} />
                
                <input type="date" name="dateMin" id="dateMin"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                <input type="date" name="dateMax" id="dateMax"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                
                <select name="typeId" id="typeId">
                    <option value={""}> no category </option>
                    {adTypes.map( (value, key) => {
                        return (<option value={value?.idAdType} key={key}> { value?.name } </option>)
                    } )}
                </select>

                <select name="sortBy" id="sortBy">
                    {adSortBy.map( (value, key) => {
                        return (<option value={value?.sortParam} key={key}> { value?.sortVisual } </option>)
                    } )}
                </select>
                <input type="range" name="reverseSort" id="reverseSort" 
                    min={0} max={1} defaultValue={0}/>
                
                <input type="text" name="tagListId" id="tagListId"
                    placeholder="list all tags (by id)" defaultValue={""} />

                <input type="number" name="shapeId" id="shapeId" 
                    min={0} max={5} defaultValue={""} placeholder="Shape"/>
                <input type="number" name="filterSold" id="filterSold"
                    min={0} max={1} defaultValue={""} placeholder="Sold"/>
            </div>
            
        </div>
    )
}

export default SearchFilters;