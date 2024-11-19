package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.DeviceCategory;
import com.othr.rentopia.service.DeviceCategoryService;

@Service
public class DeviceCategoryServiceImpl implements DeviceCategoryService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
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
    public void removeDeviceCategory(Long deviceCategoryId) {
	String query = "DELETE a FROM DeviceCategory a WHERE a.id = :deviceCategoryId";
	try {
	    entityManager
		.createQuery(query, DeviceCategory.class)
		.setParameter("deviceCategoryId", deviceCategoryId)
		.executeUpdate();
	} catch (NoResultException e) {
	}
    }
}
