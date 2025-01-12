import Cookie from 'js-cookie';
import {json, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export const JWT_TOKEN = "jwtToken";

export function JWTTokenExists(){
    let cookie = Cookie.get(JWT_TOKEN);
    return cookie !== undefined && cookie !== "undefined";
}

export function Logout(){
    Cookie.remove(JWT_TOKEN);
}

export function GetAuthUser(){
    const [authUser, setAuthUser] = useState(null);
    useEffect(() =>{
        if(JWTTokenExists()){
            FetchBackend('GET', 'user/me',null)
                .then(response => response.json())
                .then(data => {
                    setAuthUser(data);
                })
                .catch(error => console.log(error))
        }
    }, []);

    return authUser;
}

export function ReturnHomeWhenLoggedIn(){
    const navigation = useNavigate();
    useEffect(() => {
        if(JWTTokenExists()){
            navigation("/");
        }
    }, [])
}

//todo remove
export function ReturnHomeWhenLoggedOut(){
    const navigation = useNavigate();
    useEffect(() => {
        if(!JWTTokenExists()){
            navigation("/");
        }
    }, [])
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

    return fetch('http://127.0.0.1:8080/api/'+uri, requestOptions);
}

export function FetchBackendMultiPart(httpMethod, uri, formData) {
    const requestOptions = {
        method: httpMethod,
        headers: {
            credentials: 'include',
        },
        body: formData,
    };

    if (JWTTokenExists()) {
        requestOptions.headers.Authorization = "Bearer " + Cookie.get(JWT_TOKEN);
    }

    console.log("Request Options:", requestOptions);
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); // Log key-value pairs for debugging
    }

    return fetch(`http://127.0.0.1:8080/api/${uri}`, requestOptions);
}

export default FetchBackend;