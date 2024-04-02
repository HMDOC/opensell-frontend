import {ReactElement, useEffect, useState } from "react";
import "../../css/component/page/SearchBar.css";
import { getAllAdTypes } from "../../services/AdService";
import { AxiosError } from "axios";
import { AdType } from "../../entities/dto/AdType";

/** 
    The component that holds all of the filter options.
    @author Davide
*/
const SearchFilters = (props) : ReactElement =>{
    const filtersUpdated = (event) => props.filterUpdate(event);

    const priceMax = 99990;
    const dateMin = "2020-01-01";
    const dateMax = "3000-01-01";

    const [adTypes, setAdTypes] = useState<Array<AdType>>(new Array());
    const adSortBy = [
        {sortParam : "", sortVisual : "Added Date"},
        {sortParam : "title", sortVisual : "Title"},
        {sortParam : "price", sortVisual : "Price"}
    ]

    const shapeTextList = [
        "Brand New", 
        "Opened", 
        "Barely Used", 
        "Used", 
        "Bad", 
        "Unknown"
    ]

    useEffect( () => {
        getAllAdTypes().then(res => {
            setAdTypes(res?.data);
        }).catch((e:AxiosError) => {
            setAdTypes([{idAdType: 2, name:"No ad type found"}]);
        })
    }, [])

    // {adTypes.forEach( (value, key) => {} )}
    return (
        <div onChange={filtersUpdated}>            
            <div id="filterContainer" ref={props.filterElementRef}>
                <h5>Price</h5>
                <input type="range" name="priceMin" id="priceMin"
                    min={0} max={priceMax} defaultValue={0} step={10}/>

                <input type="range" name="priceMax" id="priceMax"
                    min={0} max={priceMax} defaultValue={priceMax} step={10} />
                
                <h5>Date</h5>
                <input type="date" name="dateMin" id="dateMin"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                <input type="date" name="dateMax" id="dateMax"
                    min={dateMin} max={dateMax} defaultValue={null}/>
                
                <h5>Category</h5>
                <select name="typeId" id="typeId">
                    <option value={""}> no category </option>
                    {adTypes.map( (value, key) => {
                        return (<option value={value?.idAdType} key={key}> { value?.name } </option>)
                    } )}
                </select>

                <h5>Sorting</h5>
                <select name="sortBy" id="sortBy">
                    {adSortBy.map( (value, key) => {
                        return (<option value={value?.sortParam} key={key}> { value?.sortVisual } </option>)
                    } )}
                </select>
                
                <input type="range" name="reverseSort" id="reverseSort" 
                    min={0} max={1} defaultValue={0}/>
                
                <h5>Tags</h5>
                <input type="text" name="tagListId" id="tagListId"
                    placeholder="list all tags (by id)" defaultValue={""} />

                <h5>Shape</h5>
                <select name="shapeId" id="shapeId">
                    <option value=""> All </option>
                    {shapeTextList.map( (value, key) => {
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
            
        </div>
    )
}

export default SearchFilters;