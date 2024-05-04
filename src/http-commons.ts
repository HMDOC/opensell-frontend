import axios from "axios";
import data from "./data.json";

/* You need to create a JSON named data.json in /src with a url attribut, 
that point to Spring baseURL */
export default axios.create(
    {
        baseURL : data.url,
    }
)