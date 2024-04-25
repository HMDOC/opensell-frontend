import { ReactElement, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import AdPreview from "./AdPreview";
import "../../css/component/page/Catalog.css"
import { getAdBySearch } from "../../services/AdService";
import { useSearchParams } from "react-router-dom";
import LoadingIcon from "../part/LoadingIcon";
import { AxiosError, AxiosStatic } from "axios";
import { HtmlCode } from "../../services/verification/HtmlCode";

/** 
    The catalog page and all of its important components
    @author Davide
*/
const ResultList = (): ReactElement => {

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
        ],
        badrequest: [
            "No requests but us script kitties!",
            "Looks like your request is somehow invalid.",
            "Purrhaps you used unsupported parameters or the syntax is invalid?"
        ],
        badresponse: [
            "No response but us script kitties!",
            "Looks like our response is somehow invalid.",
            "It's unlikely, due the error type," +
            "but purrhaps you did something that caused this?"
        ],
        toomanyrequests: [
            "No requests but us script kitties!",
            "Looks like youre sending too many requests.",
            "Purrhaps you can take a break and touch grass?"
        ],
        deprecated: [
            "Nothing but us script kitties!",
            "Looks like youre trying to use something thats deprecated.",
            "Purrhaps you can navigate elsewhere?"
        ],
        unknown: [
            "No unknown errors but us script kitties!",
            "We REALLY don't know what happened!",
            "Purrhaps you should try again?"
        ]
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview[]>([]);
    const [searchClick, setSearchClick] = useState(false);
    const searchBarRef = useRef<HTMLInputElement>();
    const [isLoading, setLoading] = useState<boolean>();
    const [searchError, setSearchError] = useState<string[]>(errors.regular);

    const [filtersUpdated, setFiltersUpdated] = useState();
    const filterRef = useRef<HTMLDivElement>();
    const reverseSortRef = useRef<HTMLInputElement>();
    const [filterOptions, setFilterOptions] = useState<any>({ query:"" });
    
    // AdTags
    const [searchTags, setSearchTags] = useState<Array<string>>(searchParams.getAll("adTags"));
    
    useEffect(() => {
        let tmpFilterOptions = {};
        filterRef.current.childNodes.forEach((value: HTMLInputElement, key: number) => {
            console.log(`${value?.name} - ${value?.value} - ${value?.defaultValue}`);
            if ((value?.value !== value?.defaultValue) && (value?.value !== "")) {
                tmpFilterOptions[`${value?.name}`] = value.value;
            }
        });

        tmpFilterOptions["adTags"] = searchTags;
        if (reverseSortRef.current.checked)
            tmpFilterOptions["reverseSort"] = 1;

        setFilterOptions(tmpFilterOptions);
    }, [filtersUpdated]);

    useEffect(() => {
        searchBarRef.current.value = searchParams.get("query");
        reverseSortRef.current.checked = searchParams.get("reverseSort")==="1"

        let tmpFilterOptions = filterOptions;
        tmpFilterOptions["adTags"] = searchTags;
        if (reverseSortRef.current.checked){
            tmpFilterOptions["reverseSort"] = 1;
        }
        
        searchParams.forEach((value, key) => {
            tmpFilterOptions[key] = value;
            let element: any = document.querySelector(`#${key}`);
            if (element != null) {
                element.value = value
            }
        });

        setFilterOptions(tmpFilterOptions);
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);

        let tmpQueryParams: any = filterOptions;
        tmpQueryParams["adTags"] = searchTags;
        tmpQueryParams["query"] = searchBarRef.current.value;
        setSearchParams(tmpQueryParams);

        getAdBySearch(searchBarRef.current.value, filterOptions).then(res => {
            setSearchError(errors.regular);
            
            setListOfAds(res?.data);
            setLoading(false);
        }).catch((e: AxiosError) => {
            switch (e.code) {
                case AxiosError.ERR_NETWORK:
                    setSearchError(errors.cantConnect);
                    break;
                case AxiosError.ERR_CANCELED:
                    setSearchError(errors.canceled);
                    break;
                case AxiosError.ERR_BAD_REQUEST:
                    setSearchError(errors.badrequest);
                    break;
                case AxiosError.ERR_BAD_RESPONSE:
                    setSearchError(errors.badresponse);
                    break;
                case AxiosError.ERR_NOT_SUPPORT:
                    setSearchError(errors.toomanyrequests);
                    break;
                case AxiosError.ERR_DEPRECATED:
                    setSearchError(errors.deprecated);
                    break;
                default:
                    setSearchError(errors.unknown);
                    break;
            }

            console.log(e);

            setListOfAds(new Array<AdSearchPreview>());
            setLoading(false);
        });

    }, [searchClick]);


    return (
        <div className="catalog-div">
            <div className="div-filters">
                <SearchBar 
                    filterUpdate={setFiltersUpdated} 
                    filters={filterRef} 
                    reference={searchBarRef} 
                    click={setSearchClick} 
                    searchTags={searchTags} 
                    setSearchTags={setSearchTags}
                    reverseSort={reverseSortRef}
                    defSortValue={searchParams.get("reverseSort")==="1"} />
            </div>
            <div id="searchResult" >
                {
                    (isLoading) ?
                        <LoadingIcon /> :
                        (listOfAds.length > 0) ?
                            listOfAds.map((data: AdSearchPreview, i: number) => {
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
                            }) :
                            <div className="searchEmpty">
                                {searchError.map((val, index) => {
                                    return (
                                        <div id={(index == 0) ? "errorTitle" : ""}
                                            key={`error${index}`}>
                                            {val}
                                        </div>
                                    )
                                })}
                            </div>
                }
            </div>
        </div>
    )
}

export default ResultList;