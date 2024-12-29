package com.othr.rentopia.service;

import com.othr.rentopia.model.Ticket;

import java.util.List;

public interface TicketService {
    List<Ticket> getAllTicketsByStatus(Ticket.Status status);
    List<Ticket> getTicketByUserId(Long userId);
    Ticket getTicketById(Long ticketId);

    void saveTicket(Ticket ticket);

    void updateTicket(Ticket ticket);

    void deleteTicket(Long ticketId);
}
