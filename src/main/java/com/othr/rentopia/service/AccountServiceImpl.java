package com.othr.rentopia.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceException;
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
	    try {
		entityManager.persist(account);
	    } catch (PersistenceException e) {
		System.out.println("Account " + account.getEmail() + " already exists in the database");
		// TODO handle below exception
		throw e;
	    }
        } else {
            // Update existing account
            entityManager.merge(account);
        }
    }

    @Override
    public Account getAccount(String email) {
	// TODO private!!!. no password info for normal getAccount
	Account account = null;

	String query = "SELECT a FROM Account a WHERE a.email = :email";
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

	String query = "SELECT a.password FROM Account a WHERE a.email = :email";
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

    @Override
    public void removeAccount(Long accountId) {
	String query = "DELETE a FROM Account a WHERE a.id = :accountId";
	try {
	    entityManager
		.createQuery(query, Account.class)
		.setParameter("accountId", accountId)
		.executeUpdate();
	} catch (NoResultException e) {
	}
    }
}
