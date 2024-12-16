package com.othr.rentopia.controller;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.model.Ticket;
import com.othr.rentopia.service.TicketServiceImpl;
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
        ticketService.deleteTicket(ticketId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<String> createTicket(@RequestBody String ticketInfo){
        //todo parse ticketInfo
        Ticket newTicket = new Ticket();
        ticketService.saveTicket(newTicket);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
