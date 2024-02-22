import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import AdPreview from "./AdPreview";
import { getAdBySearch } from "../../services/AdService";

/*
    THIS IS UNFINISHED
*/

const resultList = () : ReactElement => {

    //const query = useRef();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview[]>( [] );
    useEffect(() => {
        /*
        getAdBySearch("").then(res => {
            if (res?.data){
                setListOfAds(res.data);
            }
        })
        */
       setListOfAds([undefined, undefined]);
       console.log(listOfAds);
    }, []);

    return (
        <>
            <h1>Catalog</h1>
            <SearchBar />
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

export default resultList;