import Appbar from "../components/Appbar.js";
import * as React from "react";
import {Box, Typography, Grid2, Button, ListItem, List, ListItemButton, ListItemText} from "@mui/material";
import Footer from "../components/Footer.js";
import FetchBackend, {
    GetAuthUser, JWTTokenExists,
    ReturnHomeWhenLoggedOut
} from "../helper/BackendHelper.js";
import TicketDetail from "../components/TicketDetailComponent.js";
import ResponsePopup from "../components/ResponsePopup.js";
import {useEffect, useState} from "react";
import {FrameStyle} from "./Register.js";

function HelpCenterSite({adm = false}){
    ReturnHomeWhenLoggedOut();

    const authUser = GetAuthUser();

    const [tickets, setTickets] = React.useState([]);
    const [ticketDetailComponent, setTicketDetailComponent] = React.useState(null);
    const [statusLabel, setStatusLabel] = React.useState(null);
    const [isAdminPage, setIsAdminPage] = React.useState(false);


    //init
    useEffect(()=>{
        setIsAdminPage(adm);
        fetchTickets();
    }, [authUser, adm]);

    const fetchTickets = () => {
        if(authUser != null){
            FetchBackend("GET", "ticket/all/"+authUser.id, null)
                .then(response => response.json())
                .then(data => setTickets(data))
                .catch(e => {
                    setStatusLabel(<ResponsePopup message={"Help Center is currently not available. Please try again"}
                                                  reason={"error"}/>);
                });
        }
    };
    const handleTicketSelection = (index) => {
        if(tickets != null && index >= 0 && index < tickets.length){
            const handleChange = (e) =>{
                const {name, value} = e.target;
                const newTickets = tickets;

                newTickets[index][name] = value;
                setTickets(newTickets);

                setTicketDetailComponent(<TicketDetail ticketInfo={tickets[index]}
                                                       handleChange={handleChange}
                                                       handleTicketAction={handleTicketAction}/>);
            };

            setTicketDetailComponent(<TicketDetail ticketInfo={tickets[index]}
                                                   handleChange={handleChange}
                                                   handleTicketAction={handleTicketAction}/>);
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
                ownerId : authUser.id,
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
            fetchTickets();
            setTicketDetailComponent(null);
        }
    };



    //adm
    return (<Box sx = {{ ...FrameStyle}}>
        <Appbar authUser={authUser}/>
            <Grid2 container sx={{width : "100%", height : "100%"}}>
                <Grid2 size={3} sx={{padding : "1%"}}>{
                    isAdminPage ?
                        <Box/>
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