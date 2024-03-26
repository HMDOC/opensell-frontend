import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import AdPreview from "./AdPreview";
import "../../css/component/page/Catalog.css"
import { getAdBySearch } from "../../services/AdService";
import { useSearchParams } from "react-router-dom";

/** 
    The catalog page and all of its important components
    @author Davide
*/
const ResultList = () : ReactElement => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview[]>( [] );
    const searchBarRef = useRef<HTMLInputElement>();
    const [searchClick, setSearchClick] = useState(false);

    const [filtersUpdated, setFiltersUpdated] = useState();
    const filterRef = useRef<HTMLDivElement>();
    const [filterOptions, setFilterOptions] = useState({});

    useEffect(() =>{
        let tmpFilterOptions = {};
        filterRef.current.childNodes.forEach( (value:HTMLInputElement, key:number) => {
            console.log(`${value?.name} - ${value?.value} - ${value?.defaultValue}`);
            if ((value?.value!==value?.defaultValue) && (value?.value!=="")){
                tmpFilterOptions[`${value?.name}`] = value.value;
            }
        });

        console.log(tmpFilterOptions);

        setFilterOptions(tmpFilterOptions);

    }, [filtersUpdated]);

    useEffect( () => {
        searchBarRef.current.value = searchParams.get("query");
        let tmpFilterOptions = filterOptions;
        searchParams.forEach( (value, key) => {
            tmpFilterOptions[key] = value;
            let element:any = document.querySelector(`#${key}`);
            if (element!=null){
                element.value = value
            }
        });
        setFilterOptions(tmpFilterOptions);
    }, [searchParams]);

    useEffect(() => {
        getAdBySearch(searchBarRef.current.value, filterOptions).then(res => {
            setListOfAds(res?.data);
        }).catch(e => console.log(e));

        let tmpQueryParams:any = filterOptions;

        console.log(tmpQueryParams);

        setSearchParams(tmpQueryParams);
    }, [searchClick]);


    return (
        <>
            <div id="searchTop">
                <h2>Catalog</h2>
                <SearchBar filterUpdate={setFiltersUpdated} filters={filterRef} reference={searchBarRef} click={setSearchClick} />
            </div>
            
            <div id="searchResult">
            {(listOfAds.length>0) ? listOfAds.map( (data : AdSearchPreview, i : number) => {
                    //console.log(data);
                    //console.log(i);
                    return (
                        <AdPreview
                            key={`ad-preview-${i}`}
                            link={data?.adLink}
                            price={data?.adPrice}
                            shape={data?.adShape}
                            title={data?.adTitle}
                            isSold={data?.isAdSold}
                            firstImagePath={data?.adFirstImagePath}
                        />
                    )
                } ) : <div className="searchEmpty">Nobody here but us script kitties!</div>}
            </div>
        </>
    )
}

export default ResultList;