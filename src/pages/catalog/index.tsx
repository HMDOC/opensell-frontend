import { LoadingIcon } from "@components/animations/loading";
import { Grid, Pagination, Stack } from "@mui/material";
import { getAdBySearch } from "@services/ad/catalog";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";
import { AxiosError } from "axios";
import { ReactElement, useState } from "react";
import AdPreview from "./components/ad-preview";
import SearchFilters from "./components/search-filters";
import "./style.css";
import { MARGIN_TOP_FOR_SECTION } from "@context/AppContext";
import { useParams, useSearchParams } from "react-router-dom";

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
    const [listOfAds, setListOfAds] = useState<AdPreviewDto[]>([]);
    const [isLoading, setLoading] = useState<boolean>();
    const [searchError, setSearchError] = useState<string[]>(errors.regular);
    const [urlParams, setUrlParams] = useSearchParams({page: "1"});

    const [itemsPerPage, setItemsPerPage] = useState<number>(12);
    const [pageCount, setPageCount] = useState<number>(1);
    const [pageNb, setPageNb] = useState<number>( () => {
            let pageUrl =urlParams.get("page");
            return (pageUrl) ? Number.parseInt(pageUrl) : 1;
        }
    );

    const search = async (filters: any) => {
        setLoading(true);

        console.log("FILTERS : ", filters)

        await getAdBySearch(filters).then(res => {
            setSearchError(errors.regular);

            setListOfAds(res?.data);
            setPageCount(Math.ceil(res?.data.length/itemsPerPage))

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

    const pageNumberChange = (_event : any, value : number) =>{
        setPageNb(value)
        
        urlParams.set("page", `${value}`)
        setUrlParams(urlParams)
    }

    const getPageItems = () =>{
        let page = ((pageNb - 1)*itemsPerPage);

        return listOfAds?.slice(page, page + itemsPerPage);
    }

    return (
        <Stack marginTop={MARGIN_TOP_FOR_SECTION} direction="row" spacing={2} justifyContent="center">
            <title>Catalog</title>

            <Stack>
                <SearchFilters searchMethod={search} />
                <Stack marginY={2} alignSelf="center">
                    <Pagination count={pageCount} page={pageNb} siblingCount={0} boundaryCount={1} color="primary" onChange={pageNumberChange}/>
                </Stack>
            </Stack>

            <Grid container direction="row" gap={2} flexWrap={"wrap"} width="1500px" marginRight="350px">
                {(isLoading) ?
                    <LoadingIcon /> :
                    (listOfAds.length > 0) ?
                        (
                            getPageItems().map((data: AdPreviewDto, i: number) => (
                                <Stack key={`ad-preview-${i}`}>
                                    <AdPreview
                                        id={data?.id}
                                        {...data}
                                    />
                                </Stack>
                            ))
                        ) : (
                            <Stack className="searchEmpty" width="100%">
                                {searchError.map((val, index) => (
                                    <Stack
                                        id={(index === 0) ? "errorTitle" : ""}
                                        key={`error-${index}`}
                                    >
                                        {val}
                                    </Stack>
                                ))}
                            </Stack>
                        )
                }
            </Grid>
        </Stack>
    )
}