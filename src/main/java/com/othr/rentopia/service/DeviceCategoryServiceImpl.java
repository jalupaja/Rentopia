package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.DeviceCategory;
import com.othr.rentopia.service.DeviceCategoryService;

@Service
public class DeviceCategoryServiceImpl implements DeviceCategoryService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveDeviceCategory(DeviceCategory deviceCategory) {
	entityManager.persist(deviceCategory);
    }

    @Override
    public List<String> getAllDeviceCategories() {
	List<String> deviceCategories = null;

	String query = "SELECT DISTINCT c.name FROM DeviceCategory c";
	try {
	    deviceCategories = entityManager
		    .createQuery(query, String.class)
		    .getResultList();
	} catch (NoResultException e) {
	}

	return deviceCategories;
    }

    @Override
    public void removeDeviceCategory(String deviceCategory) {
	String query = "DELETE FROM DeviceCategory WHERE name = :deviceCategory";
	try {
	    entityManager
		.createQuery(query)
		.setParameter("deviceCategory", deviceCategory)
		.executeUpdate();
	} catch (PersistenceException e) {
	    System.err.println("ERROR removing DeviceCategory " + deviceCategory + ": " + e.getMessage());
	}
    }
}
