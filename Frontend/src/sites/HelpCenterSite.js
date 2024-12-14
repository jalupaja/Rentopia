import Appbar from "../components/Appbar.js";
import * as React from "react";
import {Box, Typography, Grid2, Button, ListItem, List, ListItemButton, ListItemText} from "@mui/material";
import Footer from "../components/Footer.js";
import FetchBackend, {
    GetAuthUser,
    ReturnHomeWhenLoggedOut
} from "../helper/BackendHelper.js";
import TicketDetail from "../components/TicketDetailComponent.js";

function HelpCenterSite(){
    ReturnHomeWhenLoggedOut();

    let authUser = GetAuthUser();

    //const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const [tickets, setTickets] = React.useState([]);
    const [ticketDetailComponent, setTicketDetailComponent] = React.useState(null);

    const handleTicketSelection = (index) => {
        if(tickets != null && index >= 0 && index < tickets.length){
            setTicketDetailComponent(<TicketDetail ticket={tickets[index]}/>);
        }
    }
    const addNewTicket = () =>{
        setTickets([
            ...tickets,
            {
                id : "-1",
                title : "new ticket",
                status : "new"
            }
        ]);

        //todo
        //handleTicketSelection(tickets.length-1);
    }
    return (<Box>
        <Appbar authUser={authUser}/>
            <Grid2 container>
                <Grid2 size={3} sx={{padding : "1%"}}>
                    <Button variant="contained" onClick={addNewTicket}>New Ticket</Button>
                    <List>
                        {tickets.map((ticket, index) => (
                            <ListItemButton
                                key={index} onClick={() => handleTicketSelection(index)}>{ticket.title}
                            </ListItemButton>
                            )
                        )}
                    </List>

                </Grid2>
                <Grid2 size={9}>{ticketDetailComponent}</Grid2>
            </Grid2>

        <Footer/>
    </Box>
    );
}

export default HelpCenterSite;