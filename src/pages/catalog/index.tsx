import { LoadingIcon } from "@components/animations/loading";
import { Grid, Stack } from "@mui/material";
import { getAdBySearch } from "@services/ad/catalog";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";
import { AxiosError } from "axios";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdPreview from "./components/ad-preview";
import SearchFilters from "./components/search-filters";
import "./style.css";

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
};

/** 
    The catalog page and all of its important components
    @author Davide
*/
export default function Catalog(): ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const [listOfAds, setListOfAds] = useState<AdPreviewDto[]>([]);
    const searchBarRef = useRef<HTMLInputElement>(null);
    const [isLoading, setLoading] = useState<boolean>();
    const [searchError, setSearchError] = useState<string[]>(errors.regular);

    // AdTags
    //const [searchTags, setSearchTags] = useState<Array<string>>(searchParams.getAll("adTags"));
    
    /*
    useEffect(() => {
        let tmpFilterOptions: any = {};
        filterRef?.current?.childNodes.forEach((value: any) => {
            console.log(`${value?.name} - ${value?.value} - ${value?.defaultValue}`);
            if ((value?.value !== value?.defaultValue) && (value?.value !== "")) {
                tmpFilterOptions[value?.name as string] = value.value;
            }
        });

        //tmpFilterOptions["adTags"] = searchTags;

        setFilterOptions(tmpFilterOptions);
    }, [filtersUpdated]);

    useEffect(() => {
        if (searchBarRef?.current) searchBarRef.current.value = searchParams.get("query") as string;

        let tmpFilterOptions = filterOptions;
        //tmpFilterOptions["adTags"] = searchTags;

        searchParams.forEach((value, key : string) => {
            console.log(key, value, defaultFilters[key])
            
            if (value !== defaultFilters[key]){
                let val : any = value
                if (typeof defaultFilters[key] === "number"){
                    val = parseInt(value)
                }
                if (key.includes("date")){
                    val = dayjs(value)
                }

                tmpFilterOptions[key] = val;
            }
        });

        setFilterOptions(tmpFilterOptions);
    }, [searchParams]);
    */

    const search = (filters : any) => {
        setLoading(true);

        let tmpQueryParams: any = filters;
        //tmpQueryParams["adTags"] = searchTags;
        tmpQueryParams["query"] = searchBarRef.current?.value;
        setSearchParams(tmpQueryParams);

        console.log(tmpQueryParams)

        getAdBySearch(searchBarRef?.current?.value!, filters).then(res => {
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

            setListOfAds(new Array<AdPreviewDto>());
            setLoading(false);
        });

    };

    useEffect( () => {
        search({})
    }, []);

    return (
        <Stack marginTop={10} direction="row" spacing={2} justifyContent="center">
            <title>Catalog</title>

            <Stack>
                <SearchFilters
                    reference={searchBarRef}
                    defSortValue={searchParams.get("reverseSort") === "1"}
                    searchMethod={search} />
            </Stack>

            <Grid container direction="row" gap={2} flexWrap={"wrap"} width="1500px" marginRight="350px">
                {(isLoading) ?
                    <LoadingIcon /> :
                    (listOfAds.length > 0) ?
                        (
                            listOfAds?.map((data: AdPreviewDto, i: number) => (
                                <Stack key={`ad-preview-${i}`}>
                                    <AdPreview
                                        id={data?.id}
                                        {...data}
                                    />
                                </Stack>
                            ))
                        ) : (
                            <Stack className="searchEmpty" width="100%">
                                {searchError.map((val, index) => {
                                    return (
                                        <Stack
                                            id={(index === 0) ? "errorTitle" : ""}
                                            key={`error${index}`}
                                        >
                                            {val}
                                        </Stack>
                                    )
                                })}
                            </Stack>
                        )
                }
            </Grid>
        </Stack>
    )
}