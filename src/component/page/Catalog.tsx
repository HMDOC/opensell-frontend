import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import AdPreview from "./AdPreview";
import "../../css/component/page/Catalog.css"
import { getAdBySearch } from "../../services/AdService";
import { useSearchParams } from "react-router-dom";

/*
    THIS IS UNFINISHED
*/

const ResultList = () : ReactElement => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview[]>( [] );
    const searchBarRef = useRef<HTMLInputElement>();
    const [searchClick, setSearchClick] = useState(false);
    const [filterOptions, setFilterOptions] = useState({});

    useEffect( () => {
        searchBarRef.current.value = searchParams.get("query");
        let tmpFilterOptions = filterOptions;
        searchParams.forEach( (value, key) => {
            tmpFilterOptions[key] = value;
        });
        setFilterOptions(tmpFilterOptions);
    }, [searchParams]);

    useEffect(() => {
        getAdBySearch(searchBarRef.current.value, filterOptions).then(res => {
            setListOfAds(res?.data);
        }).catch(e => console.log(e));

        let tmpQueryParams:any = filterOptions;

        setSearchParams(tmpQueryParams);
    }, [searchClick]);

    return (
        <>
            <div id="searchTop">
                <h1>Catalog</h1>
                <SearchBar reference={searchBarRef} click={setSearchClick} />
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
                } ) : <div className="searchEmpty">Nobody here but kittens!</div>}
            </div>
        </>
    )
}

export default ResultList;