package com.othr.rentopia.controller;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Ticket;
import com.othr.rentopia.service.TicketServiceImpl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController()
@RequestMapping("api/ticket")
public class TicketController {

    @Autowired
    private TicketServiceImpl ticketService;

    @GetMapping(path="all/{userId}", produces="application/json")
    public ResponseEntity<List<Ticket>> getUserTickets(@PathVariable("userId") Long userId) {
        List<Ticket> userTickets = ticketService.getTicketByUserId(userId);
        return new ResponseEntity<>(userTickets, HttpStatus.OK);
    }

    @DeleteMapping("{ticketId}")
    public ResponseEntity<String> deleteTicket(@PathVariable("ticketId") Long ticketId){
        if(ticketId != null && ticketId >= 0){
            try{
                ticketService.deleteTicket(ticketId);
            } catch(Exception e){
                System.out.println("Deleting ticket threw excption : "+ e.getMessage());
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<String> createTicket(@RequestBody String ticketInfo){
        JSONObject request = new JSONObject(ticketInfo);

        Ticket newTicket = new Ticket();

        if(request.get("id") != null){
            //todo ?
        }

        newTicket.setStatus(Ticket.Status.Open);
        newTicket.setTitle((String)request.get("title"));
        newTicket.setDetails((String)request.get("details"));
        Integer ownerId = (Integer) request.get("ownerId");
        newTicket.setOwnerID(ownerId.longValue());

        String category = (String) request.get("category");
        newTicket.setCategory(Ticket.Category.valueOf(category.toLowerCase()));

        try{
            ticketService.saveTicket(newTicket);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
