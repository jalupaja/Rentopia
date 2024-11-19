package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Device;
import com.othr.rentopia.service.DeviceService;

@Service
public class DeviceServiceImpl implements DeviceService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void saveDevice(Device device) {
	entityManager.persist(device);
    }

    @Override
    public List<Device> getDevicesByOwner(Long ownerId) {
	List<Device> devices = null;

	String query = "SELECT d FROM Device d WHERE d.owner = :ownerId";
	try {
	    devices = entityManager
		    .createQuery(query, Device.class)
		    .setParameter("owner", ownerId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	return devices;
    }

    public List<Device> getDevicesByCategory(Long categoryId) {
	List<Device> devices = null;

	String query = "SELECT d FROM Device d JOIN d.categories c WHERE c.id = :categoryId";
	try {
	    devices = entityManager
		    .createQuery(query, Device.class)
		    .setParameter("categoryId", categoryId)
		    .getResultList();
	} catch (NoResultException e) {
	}

	return devices;
    }

    @Override
    public void removeDevice(Long deviceId) {
	String query = "DELETE d FROM Device d WHERE d.id = :deviceId";
	try {
	    entityManager
		.createQuery(query, Device.class)
		.setParameter("deviceId", deviceId)
		.executeUpdate();
	} catch (NoResultException e) {
	}
    }
}
