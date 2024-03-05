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
    const searchBarRef = useRef("lor");

    useEffect(() => {
        
        getAdBySearch(searchBarRef.current).then(res => {
            if (res?.data){
                setListOfAds(res.data);
            }
        })
        
       console.log(listOfAds);
    }, []);
    // <SearchBar ref={searchBarRef}/>
    return (
        <>
            <div id="searchTop">
                <h1>Catalog</h1>
                <SearchBar />
            </div>
            
            <div id="searchResult">
                {listOfAds.map( (data : AdSearchPreview, i : number) => {
                    console.log(data);
                    console.log(i);
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
                } )}
            </div>
        </>
    )
}

export default ResultList;