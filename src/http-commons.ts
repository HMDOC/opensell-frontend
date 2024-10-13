import axios from "axios";

/* You need to create a JSON named data.json in /src with a url attribut, 
that point to Spring baseURL */
export default axios.create(
    {
        baseURL : process.env.REACT_APP_BACKEND_URL,
    }
)