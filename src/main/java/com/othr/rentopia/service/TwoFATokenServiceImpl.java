package com.othr.rentopia.service;

import com.othr.rentopia.model.Account;
import com.othr.rentopia.model.TwoFAToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class TwoFATokenServiceImpl implements TwoFATokenService {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public TwoFAToken createToken(Account user) {
        removeTokenFromUser(user);

        TwoFAToken token = new TwoFAToken();
        token.setToken(UUID.randomUUID().toString());
        token.setAuthCode(new Random().nextInt(999999));
        token.setExpiration(LocalDateTime.now().plusMinutes(TwoFAToken.EXPIRATION));
        token.setUserEmail(user.getEmail());

        entityManager.persist(token);

        return token;
    }

    @Override
    public TwoFAToken getTokenByValue(String tokenValue) {
        TwoFAToken token = null;

        String query = "SELECT a FROM TwoFAToken a WHERE a.token = :tokenValue";
        try {
            token = entityManager
                    .createQuery(query, TwoFAToken.class)
                    .setParameter("tokenValue", tokenValue)
                    .getSingleResult();
        } catch (NoResultException e) {
            System.out.println("Selecting token threw exception: "+e.getMessage());
        }

        return token;
    }

    @Override
    @Transactional
    public void removeTokenById(Long tokenId) {
        String query = "DELETE FROM TwoFAToken WHERE id = :tokenId";
            entityManager.createQuery(query)
                    .setParameter("tokenId", tokenId)
                    .executeUpdate();
    }

    @Transactional
    public void removeTokenFromUser(Account user){
        String query = "DELETE FROM TwoFAToken WHERE userEmail = :userMail";
        entityManager.createQuery(query)
                .setParameter("userMail", user.getEmail())
                .executeUpdate();
    }
}
