import Cookie from 'js-cookie';
import {json} from "react-router-dom";

export const JWT_TOKEN = "jwtToken";

export function JWTTokenExists(){
    let cookie = Cookie.get(JWT_TOKEN);
    return cookie !== undefined && cookie !== "undefined";
}
function FetchBackend(httpMethod, uri, json){
    const requestOptions = {
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json',
            'credentials' : 'include'
        },

    };

    if(JWTTokenExists()){
        requestOptions.headers.Authorization = "Bearer " + Cookie.get(JWT_TOKEN);
    }
    if(json !== null){
        requestOptions.body = JSON.stringify(json)
    }

    console.log(requestOptions);
    return fetch('http://127.0.0.1:8080/api/'+uri, requestOptions);
}

export default FetchBackend;