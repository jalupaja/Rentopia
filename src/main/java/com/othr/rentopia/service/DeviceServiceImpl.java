package com.othr.rentopia.service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Service;

import com.othr.rentopia.model.Device;

@Service
public class DeviceServiceImpl implements DeviceService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void saveDevice(Device device) {
	entityManager.persist(device);
    }

    @Override
    public Device getDevice(Long deviceId) {
		Device device = null;

		String query = "SELECT DISTINCT d FROM Device d WHERE id = :deviceId";
		try {
			device = entityManager
			.createQuery(query, Device.class)
			.setParameter("deviceId", deviceId)
			.getSingleResult();
		} catch (NoResultException e) {
			System.err.println("No device found with id " + deviceId);
		}

		return device ;
    }

    @Override
		public List<Device> getDevicesByOwner(Long ownerId) {
		List<Device> devices = null;

		String query = "SELECT d FROM Device d WHERE d.ownerId = :ownerId";
		try {
			devices = entityManager
				.createQuery(query, Device.class)
				.setParameter("ownerId", ownerId)
				.getResultList();
		} catch (NoResultException e) {
			System.err.println("No device found with owner id " + ownerId);
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
			System.err.println("No device found with category id " + categoryId);
		}

		return devices;
    }

    @Override
    public void removeDevice(Long deviceId) {
		String query = "DELETE FROM Device WHERE id = :deviceId";
		try {
			entityManager.createQuery(query)
			.setParameter("deviceId", deviceId)
			.executeUpdate();
		} catch (PersistenceException e) {
			System.err.println("ERROR removing Device with ID " + deviceId + ": " + e.getMessage());
		}
    }

	@Override
	public List<Device> getAllDevices() {
		List<Device> devices = null;

		String query = "SELECT d FROM Device d";
		try {
			devices = entityManager
					.createQuery(query, Device.class)
					.getResultList();
		} catch (NoResultException e) {
			System.err.println("No device found");
		}

		return devices;
	}
}
