import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import AdPreview from "./AdPreview";
import "../../css/component/page/Catalog.css"
import { getAdBySearch } from "../../services/AdService";

/*
    THIS IS UNFINISHED
*/

const ResultList = () : ReactElement => {

    //const query = useRef();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview[]>( [] );
    const searchBarRef = useRef<HTMLInputElement>();
    const [searchClick, setSearchClick] = useState<boolean>(false);

    useEffect(() => {
        getAdBySearch(searchBarRef.current.value).then(res => {
            setListOfAds(res?.data);
        }).catch(e => console.log(e));
        
    }, [searchClick]);
    // <SearchBar ref={searchBarRef}/>
    return (
        <>
            <div id="searchTop">
                <h1>Catalog</h1>
                <SearchBar reference={searchBarRef} click={setSearchClick}/>
            </div>
            
            <div id="searchResult">
            {(listOfAds.length>0) ? listOfAds.map( (data : AdSearchPreview, i : number) => {
                    //console.log(data);
                    //console.log(i);
                    return (
                        <AdPreview 
                            link={data?.adLink}
                            price={data?.adPrice}
                            shape={data?.adShape}
                            title={data?.adTitle}
                            isSold={data?.isAdSold}
                            firstImagePath={data?.adFirstImagePath}
                        />
                    )
                } ) : <div className="searchEmpty">Nobody here but chickens!</div>}
            </div>
        </>
    )
}

export default ResultList;