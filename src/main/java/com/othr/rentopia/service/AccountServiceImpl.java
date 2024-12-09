package com.othr.rentopia.service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

import com.othr.rentopia.model.Account;

@Service
public class AccountServiceImpl implements AccountService, UserDetailsService {

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

    public String getAccountName(Long accountId) {
        String query = "SELECT a.name FROM Account a WHERE a.id = :accountId";
        try {
            return entityManager
                .createQuery(query, String.class)
                .setParameter("accountId", accountId)
                .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

	@Override
	public Account loadUserByUsername(String email) {
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
		String db_password = "";

		String query = "SELECT a.password FROM Account a WHERE a.email = :email";
		try {
			db_password = entityManager
			.createQuery(query, String.class)
			.setParameter("email", email)
			.getSingleResult();
		} catch (NoResultException e) {
			return false;
		}

		if (db_password.equals(password)) {
			return true;
		} else {
			return false;
		}
    }

    @Override
    public void removeAccount(Long accountId) {
		String query = "DELETE FROM Account WHERE id = :accountId";
		try {
			entityManager.createQuery(query)
			.setParameter("accountId", accountId)
			.executeUpdate();
		} catch (PersistenceException e) {
			System.err.println("ERROR removing Account with ID " + accountId + ": " + e.getMessage());
		}
    }
}
