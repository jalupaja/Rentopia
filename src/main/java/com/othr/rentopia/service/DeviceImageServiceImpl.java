package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.DeviceImage;
import com.othr.rentopia.service.DeviceImageService;

@Service
public class DeviceImageServiceImpl implements DeviceImageService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveDeviceImage(DeviceImage deviceImage) {
        entityManager.persist(deviceImage);
    }

    @Override
    public List<String> getAllDeviceImages(Long deviceId) {
        List<String> deviceImages = null;

        String query = "SELECT DISTINCT c.name FROM DeviceImage c WHERE deviceId = :deviceId";
        try {
            deviceImages = entityManager
                .createQuery(query, String.class)
                .setParameter("deviceId", deviceId)
                .getResultList();
        } catch (NoResultException e) {
        }

        return deviceImages;
    }

    @Override
    public void removeDeviceImage(String deviceImage) {
        String query = "DELETE FROM DeviceImage WHERE name = :deviceImage";
        try {
            entityManager
                .createQuery(query)
                .setParameter("deviceImage", deviceImage)
                .executeUpdate();

            // TODO delete actual file
        } catch (PersistenceException e) {
            System.err.println("ERROR removing DeviceImage with the name " + deviceImage + ": " + e.getMessage());
        }
    }

    @Override
    public void removeAllDeviceImages(Long deviceId) {
        String query = "DELETE FROM DeviceImage WHERE deviceId = :deviceId";
        try {
            entityManager
                .createQuery(query)
                .setParameter("deviceId", deviceId)
                .executeUpdate();

            // TODO delete actual file
        } catch (PersistenceException e) {
            System.err.println("ERROR removing DeviceImages with the id " + deviceId + ": " + e.getMessage());
        }
    }
}
