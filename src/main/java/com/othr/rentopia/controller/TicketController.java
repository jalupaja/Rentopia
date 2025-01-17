package com.othr.rentopia.controller;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Ticket;
import com.othr.rentopia.service.AccountServiceImpl;
import com.othr.rentopia.service.TicketServiceImpl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController()
@RequestMapping("api/ticket")
public class TicketController {

    @Autowired
    private TicketServiceImpl ticketService;

    @Autowired
    private AccountServiceImpl accountService;

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

    @PostMapping("{ticketId}")
    public String closeTicket(@RequestBody String ticketInfo){
        JSONObject response = new JSONObject();
        response.put("success", false);

        Ticket ticket = ParseJsonToTicket(new JSONObject(ticketInfo));
        if(ticket == null){
            return response.toString();
        }

        if(ticket.getId() != null && ticket.getId() >= 0){

            ticket.setStatus(Ticket.Status.CLOSED);
            try{

                if(ticket.getCategory().equals(Ticket.Category.delete_account)){
                    Long userID = ticket.getOwner().getId();
                    ticket.setOwner(null);
                    ticketService.updateTicket(ticket);
                    accountService.removeAccount(userID);
                }
                else{
                    ticketService.updateTicket(ticket);
                }

            } catch(Exception e){
                System.out.println("Updating ticket threw exception : "+ e.getMessage());
                return response.toString();
            }
        }

        response.put("success", true);
        return response.toString();
    }

    @PostMapping()
    public ResponseEntity<String> createTicket(@RequestBody String ticketInfo) throws Exception {
        JSONObject request = new JSONObject(ticketInfo);

        if(!request.isNull("id")){
            throw new Exception("Ticket already exists");
            //todo ?
        }

        Ticket newTicket = ParseJsonToTicket(request);
        if(newTicket == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        newTicket.setStatus(Ticket.Status.OPEN);

        try{
            ticketService.saveTicket(newTicket);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path="/status/{status}", produces="application/json")
    public String getTicketsByStatus(@PathVariable("status") String status) {
        Ticket.Status ticketStatus;
        List<Ticket> tickets = new ArrayList<>();
        JSONObject response = new JSONObject();
        response.put("success", false);
        response.put("tickets", tickets);

        if(status != null && !status.isEmpty()){
            try{
                ticketStatus = Ticket.Status.valueOf(status.toUpperCase());
            } catch(IllegalArgumentException e){
                return response.toString();
            }

            tickets = ticketService.getAllTicketsByStatus(ticketStatus);
        }

        response.put("success", true);
        response.put("tickets", tickets);
        return response.toString();
    }

    private Ticket ParseJsonToTicket(JSONObject json){
        Ticket newTicket = new Ticket();

        Long id = getLongFromJSON(json, "id");
        if(id != -1){
            newTicket.setId(id);
        }
        newTicket.setTitle(getStringFromJSON(json,"title"));
        newTicket.setDetails(getStringFromJSON(json,"details"));
        newTicket.setAdminResponse(getStringFromJSON(json, "adminResponse"));

        JSONObject owner = (JSONObject) json.get("owner");
        Long ownerId = getLongFromJSON(owner, "id");
        Account user = accountService.getAccountById(ownerId);
        if(user == null){
            return null;
        }
        newTicket.setOwner(user);

        String status = getStringFromJSON(json, "status");
        if(status != null && status.isEmpty()){
            newTicket.setStatus(Ticket.Status.valueOf(status.toUpperCase()));
        }

        String category = (String) json.get("category");
        newTicket.setCategory(Ticket.Category.valueOf(category.toLowerCase()));

        return newTicket;
    }

    private Long getLongFromJSON(JSONObject json, String name){
        Object value = getFromJSON(json, name);
        if(value != null){
            return ((Integer)value).longValue();
        }

        return -1L;
    }
    private Object getFromJSON(JSONObject json, String name){
        return json.isNull(name) ? null : json.get(name);
    }

    private String getStringFromJSON(JSONObject json, String name){
        Object stringValue = getFromJSON(json, name);
        return stringValue == null ? "" : (String)stringValue;
    }
}
