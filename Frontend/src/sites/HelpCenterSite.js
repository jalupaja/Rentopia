import Appbar from "../components/Appbar.js";
import * as React from "react";
import {Box, Typography, Grid2, Button, ListItem, List, ListItemButton, ListItemText, Select,
FormControl, InputLabel, MenuItem} from "@mui/material";
import Footer from "../components/Footer.js";
import FetchBackend, {
    GetAuthUser, JWTTokenExists,
    ReturnHomeWhenLoggedOut
} from "../helper/BackendHelper.js";
import TicketDetail from "../components/TicketDetailComponent.js";
import ResponsePopup from "../components/ResponsePopup.js";
import {useEffect, useState} from "react";
import {FrameStyle} from "./Register.js";
import {useNavigate} from "react-router-dom";

function HelpCenterSite({adm = false}){
    ReturnHomeWhenLoggedOut();

    const authUser = GetAuthUser();

    //return home when not admin
    const navigation = useNavigate();
        useEffect(() => {
            if(authUser && authUser.role !== "ADMIN"){
                console.log(authUser);
                navigation("/");
            }
        });

    const [tickets, setTickets] = React.useState([]);
    const [ticketDetailComponent, setTicketDetailComponent] = React.useState(null);
    const [statusLabel, setStatusLabel] = React.useState(null);
    const [isAdminPage, setIsAdminPage] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState('');



    let fetchTickets = () => {};
    if(adm) {
        fetchTickets = (status) => {
            if(authUser != null && status){
                FetchBackend("GET", "ticket/status/"+status, null)
                    .then(response => response.json())
                    .then(data => {
                        if(data.success){
                            setTickets(data.tickets);
                        }
                        else{
                            setStatusLabel(<ResponsePopup message={"Help Center is currently not available. Please try again"}
                                                          reason={"error"}/>);
                        }
                    })
                    .catch(e => {
                        setStatusLabel(<ResponsePopup message={"Help Center is currently not available. Please try again"}
                                                      reason={"error"}/>);
                    });
            }
        }
    }
    else{
        fetchTickets = () => {
            if(authUser != null){
                FetchBackend("GET",  "ticket/all/"+authUser.id, null)
                    .then(response => response.json())
                    .then(data => setTickets(data))
                    .catch(e => {
                        setStatusLabel(<ResponsePopup message={"Help Center is currently not available. Please try again"}
                                                      reason={"error"}/>);
                    });
            }
        };
    }


    const handleTicketSelection = (index) => {
        if(tickets != null && index >= 0 && index < tickets.length){
            const handleChange = (e) =>{
                const {name, value} = e.target;
                const newTickets = tickets;

                newTickets[index][name] = value;
                setTickets(newTickets);

                setTicketDetailComponent(<TicketDetail ticketInfo={tickets[index]}
                                                       handleChange={handleChange}
                                                       handleTicketAction={handleTicketAction}
                                                        adm={adm}/>);
            };

            setTicketDetailComponent(<TicketDetail ticketInfo={tickets[index]}
                                                   handleChange={handleChange}
                                                   handleTicketAction={handleTicketAction}
                                                   adm={adm}/>);
        }
        else{
            setTicketDetailComponent(null);
        }
    }
    const addNewTicket = () =>{
        if(authUser == null){
            setStatusLabel(<ResponsePopup message={"Ticket creation is currently not possible. Please try again"}
                           reason={"error"}/>);
            return;
        }

        setTickets([
            ...tickets,
            {
                id : null,
                owner : authUser,
                title : "new ticket",
                status : "new",
                category : "general",
                details : ""
            }
        ]);

        //todo
        //handleTicketSelection(tickets.length-1);
    }

    const handleTicketAction = (e) => {
        if(e.message){
            let reason = e.success ? "success" : "error";
            setStatusLabel(<ResponsePopup message={e.message} reason={reason}/>);
        }
        else{
            setStatusLabel(null);
        }

        if(e.fetch){
            fetchTickets(selectedStatus);
            setTicketDetailComponent(null);
        }
    };


    const handleStatusSelection = (e) => {
        const status = e.target.value;
        setSelectedStatus(status);
        fetchTickets(status)
    };

    //init
    useEffect(()=>{
        setIsAdminPage(adm);
        setTickets([]);
        setStatusLabel(null);
        fetchTickets();
        setTicketDetailComponent(null);
    }, [authUser, adm]);
    return (<Box sx = {{ ...FrameStyle}}>
        <Appbar authUser={authUser}/>
            <Grid2 container sx={{width : "100%", height : "auto"}}>
                <Grid2 size={3} sx={{padding : "1%"}}>{
                    isAdminPage ?
                        <FormControl fullWidth sx={{marginTop : "5%"}}>
                            <InputLabel >Status</InputLabel>
                            <Select
                                id="statusSelect"
                                onChange={handleStatusSelection}
                                value={selectedStatus}
                                label="Status"
                            >
                                <MenuItem value={"open"}>Open</MenuItem>
                                <MenuItem value={"closed"}>Closed</MenuItem>
                            </Select>
                        </FormControl>
                        :
                        <Button variant="contained" onClick={addNewTicket}>New Ticket</Button>
                }
                    <List>
                        {tickets.map((ticket, index) => (
                            <ListItemButton
                                key={index} onClick={() => handleTicketSelection(index)}>{ticket.title} [{ticket.status}]
                            </ListItemButton>
                            )
                        )}
                    </List>

                </Grid2>
                <Grid2 size={9}>
                    <Grid2>
                        {statusLabel}
                    </Grid2>
                    <Grid2>
                        {ticketDetailComponent}
                    </Grid2>
                </Grid2>
            </Grid2>

            <Box sx={{flex : "auto"}}/>
        <Footer/>
    </Box>
    );
}

export default HelpCenterSite;