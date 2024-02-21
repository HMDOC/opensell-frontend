import { Component, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { getAdBySearch } from "../../services/AdService";

/*
    THIS IS UNFINISHED
*/

const resultList = () : ReactElement => {
    /*
    //const query = useRef();
    const [listOfAds, setListOfAds] = useState<AdSearchPreview>();
    useEffect(() => {
        getAdBySearch("").then(res => {
            if (res?.data){
                setListOfAds(res.data);
            }
        })
    }, []);
    */

    return (
        <>
        </>
    )
}
export default class Catalog extends Component {
    
    

    public render(): ReactNode {
        
        

        return(
            <>
                <h1>Catalog</h1>
                <SearchBar />
            </>
        );
    }

}