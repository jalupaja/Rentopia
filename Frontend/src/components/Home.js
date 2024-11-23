import {alpha, AppBar, Box, Button, InputBase, Link, styled, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.js";
import Footer from "./Footer.js";


function Home(){
    const navigate = useNavigate();

    return (
        <Box>
            <NavBar/>
            <Footer/>
        </Box>
    );
}

export default Home;