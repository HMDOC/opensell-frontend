import {ReactElement } from "react";

const SearchFilters = (props) : ReactElement =>{
    const filtersUpdated = (event) => props.filterUpdate(event);
    return (
        <div onChange={filtersUpdated} hidden>
            <h2>Filters</h2>
            
            <div id="fitlerContainer" ref={props.filterElementRef}>
                <input type="range" name="priceMin" id="priceMin" defaultValue={0} />
                <input type="range" name="priceMax" id="priceMax" />
                <input type="number" name="shape" id="shape" />
            </div>
            
        </div>
    )
}

export default SearchFilters;