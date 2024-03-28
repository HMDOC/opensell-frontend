import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import AdPreview from "./AdPreview";
import "../../css/component/page/Catalog.css"
import { getAdBySearch } from "../../services/AdService";
import { useSearchParams } from "react-router-dom";
import LoadingIcon from "../part/LoadingIcon";
import { AxiosError, AxiosStatic } from "axios";

/** 
    The catalog page and all of its important components
    @author Davide
*/
const ResultList = () : ReactElement => {

    const errors = {
        regular: [
            `Nobody here but us script kitties!`,
            "Your search query did not match any criteria.",
            "Purrhaps try using criteria that is not as strict."
        ],
        cantConnect: [
            "No contact here but us script kitties!",
            "We were not able to connect with our servers. ",
            "Purrhaps one of us tripped on the faulty wiring backstage."
        ],
        canceled: [
            "No cancellation but us script kitties!",
            "Looks like your request has somehow been cancelled.",
            "Purrhaps you should try again?"
        ] ,
        unknown: [
            "Unknown error by us script kitties!",
            "We REALLY don't know what happened!",
            "Purrhaps you should try again?"
        ]
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview[]>( [] );
    const [searchClick, setSearchClick] = useState(false);
    const searchBarRef = useRef<HTMLInputElement>();
    const [isLoading, setLoading] = useState<boolean>();
    const [searchError, setSearchError] = useState<string[]>(errors.regular);

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
        setLoading(true);

        getAdBySearch(searchBarRef.current.value, filterOptions).then(res => {
            setSearchError(errors.regular);

            setListOfAds(res?.data);
            setLoading(false);
        }).catch((e:AxiosError) => {
            //console.log(e);
            switch(e.code){
                case AxiosError.ERR_NETWORK:
                    setSearchError(errors.cantConnect);
                break;
                case AxiosError.ERR_CANCELED:
                    setSearchError(errors.canceled);
                break;
                default:
                    setSearchError(errors.unknown);
                break;
            }
            

            setListOfAds( new Array<AdSearchPreview>() );
            setLoading(false);
        });


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
            
            <div id="searchResult" >
            {
                (isLoading) ? 
                    <LoadingIcon/> :
                (listOfAds.length>0) ? 
                    listOfAds.map( (data : AdSearchPreview, i : number) => {
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
                    } ) : 
                    <div className="searchEmpty">
                        {searchError.map( (val, index) => {
                            return (
                                <div id={(index==0) ? "errorTitle" : ""}
                                    key={`error${index}`}>
                                        {val}
                                </div>
                            )
                        })}
                    </div>}
            </div>
        </>
    )
}

export default ResultList;