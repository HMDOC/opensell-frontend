import axios from "axios";

/* You need to create a JSON named data.json in /src with a url attribut, 
that point to Spring baseURL */
export default axios.create(
    {
        baseURL : import.meta.env?.VITE_BACKEND_URL,
    }
)