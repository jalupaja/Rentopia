import {alpha, AppBar, Box, Button, InputBase, Link, styled, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.js";
import Footer from "./Footer.js";
import FetchBackend, {JWTTokenExists} from "../helper/BackendHelper.js";
import {useEffect, useState} from "react";



function Home(){
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState({});

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

    return (
        <Box>
            <NavBar authUser={authUser}/>
            <Footer/>
        </Box>
    );
}

export default Home;