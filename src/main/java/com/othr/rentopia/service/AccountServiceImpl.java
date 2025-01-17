package com.othr.rentopia.service;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.Location;

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
    public Account getAccountById(Long accountId) {
        Account account = null;

        String query = "SELECT a FROM Account a WHERE a.id = :accountId";
        try {
            account = entityManager
                    .createQuery(query, Account.class)
                    .setParameter("accountId", accountId)
                    .getSingleResult();
        } catch (NoResultException e) {
			System.out.println("Selecting user threw exception: "+e.getMessage());
        }

        return account;
    }

    @Override
    public Account getAccount(String email) {
        Account account = null;

        String query = "SELECT a FROM Account a WHERE a.email = :email";
        try {
            account = entityManager
                    .createQuery(query, Account.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
			System.out.println("Selecting user threw exception: " + e.getMessage());
        }

        return account;
    }

    @Override
    public Account getAccount(Long accountId) {
        Account account = null;

        String query = "SELECT a FROM Account a WHERE a.id = :accountId";
        try {
            account = entityManager
                    .createQuery(query, Account.class)
                    .setParameter("accountId", accountId)
                    .getSingleResult();
            account.setPassword(null);
        } catch (NoResultException e) {
			System.out.println("Selecting user threw exception: " + e.getMessage());
        }

        return account;
    }

    @Override
    public Account getAccountWithPassword(String email) {
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
    public Location getLocation(Long accountId) {
        Location location = null;

        String query = "SELECT a.location FROM Account a WHERE a.id = :accountId";
        try {
            location = entityManager
                    .createQuery(query, Location.class)
                    .setParameter("accountId", accountId)
                    .getSingleResult();
        } catch (NoResultException e) {
        }

        return location;
    }

    @Override
    public String getEmail(Long accountId) {
        String email = null;

        String query = "SELECT a.email FROM Account a WHERE a.id = :accountId";
        try {
            email = entityManager
                    .createQuery(query, String.class)
                    .setParameter("accountId", accountId)
                    .getSingleResult();
        } catch (NoResultException e) {
        }

        return email;
    }

    @Override
    public Long getId(String email) {
        Long id = null;

        String query = "SELECT a.id FROM Account a WHERE a.email = :email";
        try {
            id = entityManager
                    .createQuery(query, Long.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
        }

        return id;
    }

    @Override
    public boolean isAdmin(Long accountId) {
        String query = "SELECT a.role FROM Account a WHERE a.id = :accountId";
        Account.Role role;
        try {
             role = entityManager
                    .createQuery(query, Account.Role.class)
                    .setParameter("accountId", accountId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return false;
        }

        return role == Account.Role.ADMIN;
  }


    @Override
    public boolean emailExists(String email) {
        String query = "SELECT a.id FROM Account a WHERE a.email = :email";
        try {
            entityManager
                    .createQuery(query, Long.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return true;
        } catch (NoResultException e) {
            return false;
        }
    }

    @Override
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
    @Transactional
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

	@Override
	@Transactional
	public Account updateAccount(Account account) {
		String query = "UPDATE Account a SET " +
				"a.name = :name, " +
				"a.email = :email, " +
				"a.description = :description, " +
				"a.location.postalCode = :postalCode, " +
				"a.location.city = :city, " +
				"a.location.street = :street, " +
				"a.location.country = :country, " +
				"a.company = :company " +
				"WHERE a.id = :accountId";

		try {
			entityManager.createQuery(query)
					.setParameter("name", account.getName())
					.setParameter("email", account.getEmail())
					.setParameter("description", account.getDescription())
					.setParameter("postalCode", account.getLocation().getPostalCode())
					.setParameter("city", account.getLocation().getCity())
					.setParameter("street", account.getLocation().getStreet())
					.setParameter("country", account.getLocation().getCountry())
					.setParameter("company", account.getCompany())
					.setParameter("accountId", account.getId())
					.executeUpdate();

		} catch (PersistenceException e) {
			System.err.println("ERROR Update Account with ID " + account.getId() + ": " + e.getMessage());
		}

		return getAccountById(account.getId());
	}
}
