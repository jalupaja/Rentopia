package com.othr.rentopia.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

import com.othr.rentopia.model.Account;

@Service
public class AccountServiceImpl implements AccountService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveAccount(Account account) {
        if (account.getId() == null) {
            // Create new account
            entityManager.persist(account);
        } else {
            // Update existing account
            entityManager.merge(account);
        }
    }

    @Override
    public Account getAccount(String email) {
	Account account = null;

	// String query = "SELECT u.email, u.email, u.role, u.description, u.location FROM Account u WHERE u.email = :email";
	String query = "SELECT u FROM Account u WHERE u.email = :email";
	try {
	    account = entityManager
		.createQuery(query, Account.class)
		.setParameter("email", email)
		.getSingleResult();
	} catch (NoResultException e) {
	}

	return account;
    }

    @Override
    public boolean checkPassword(String email, String password) {
	Account account = null;

	String query = "SELECT u.password FROM Account u WHERE u.email = :email";
	try {
	    account = entityManager
		.createQuery(query, Account.class)
		.setParameter("email", email)
		.getSingleResult();
	} catch (NoResultException e) {
	    return false;
	}

	if (account.getPassword().equals(password)) {
	    return true;
	} else {
	    return false;
	}
    }
}
