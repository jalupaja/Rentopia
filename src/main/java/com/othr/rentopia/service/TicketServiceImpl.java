package com.othr.rentopia.service;

import com.othr.rentopia.model.Ticket;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Ticket> getAllTicketsByStatus(Ticket.Status status) {
        return null;
    }

    @Override
    public List<Ticket> getTicketByUserId(Long userId) {
        List<Ticket> userTickets = new ArrayList<>();

        String query = "SELECT t FROM Ticket t WHERE t.ownerID = :userId";
        try {
            userTickets = entityManager
                    .createQuery(query, Ticket.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } catch (NoResultException e) {
            System.out.println(e.getMessage());
        }

        return userTickets;

    }

    @Override
    public Ticket getTicketById(Long ticketId) {
        Ticket ticket = null;
        String query = "SELECT t FROM Ticket t WHERE t.id = :ticketId";
        try {
            ticket = entityManager
                    .createQuery(query, Ticket.class)
                    .setParameter("ticketId", ticketId)
                    .getSingleResult();
        } catch (NoResultException e) {
            System.out.println(e.getMessage());
        }

        return ticket;
    }

    @Override
    @Transactional
    public void saveTicket(Ticket ticket) {
        entityManager.persist(ticket);
    }

    @Override
    public void updateTicket(Ticket ticket) {
        //entityManager.merge(account);
    }

    @Override
    @Transactional
    public void deleteTicket(Long ticketId) {
        String query = "DELETE FROM Ticket WHERE id = :ticketId";
        entityManager.createQuery(query)
                .setParameter("ticketId", ticketId)
                .executeUpdate();
    }
}
