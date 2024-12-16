import Appbar from "../components/Appbar.js";
import * as React from "react";
import {Box, Typography, Grid2, Button, ListItem, List, ListItemButton, ListItemText} from "@mui/material";
import Footer from "../components/Footer.js";
import FetchBackend, {
    GetAuthUser,
    ReturnHomeWhenLoggedOut
} from "../helper/BackendHelper.js";
import TicketDetail from "../components/TicketDetailComponent.js";
import ResponsePopup from "../components/ResponsePopup.js";
import {useEffect} from "react";

function HelpCenterSite(){
    ReturnHomeWhenLoggedOut();

    let authUser = GetAuthUser();

    const [tickets, setTickets] = React.useState([]);
    const [ticketDetailComponent, setTicketDetailComponent] = React.useState(null);

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
            setTicketDetailComponent(<TicketDetail ticket={tickets[index]}
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

    const [statusLabel, setStatusLabel] = React.useState(null);

    useEffect(()=>{
        fetchTickets();
    }, authUser);
    return (<Box>
        <Appbar authUser={authUser}/>
            <Grid2 container>
                <Grid2 size={3} sx={{padding : "1%"}}>
                    <Button variant="contained" onClick={addNewTicket}>New Ticket</Button>
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

        <Footer/>
    </Box>
    );
}

export default HelpCenterSite;