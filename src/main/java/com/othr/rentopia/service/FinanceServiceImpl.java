package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Finance;
import com.othr.rentopia.service.FinanceService;

@Service
public class FinanceServiceImpl implements FinanceService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveFinance(Finance finance) {
	entityManager.persist(finance);
    }

    @Override
    public List<Finance> getFinancesByAccount(Long accountId) {
	List<Finance> finances = null;

	String query = "SELECT f FROM Finance f WHERE f.accountId = :accountId";
	try {
	    finances = entityManager
		    .createQuery(query, Finance.class)
		    .setParameter("accountId", accountId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	return finances;
    }
}
